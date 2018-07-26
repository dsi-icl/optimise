import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect} from 'react-router-dom';
import store from '../../redux/store';
import style_scaffold from '../scaffold/scaffold.module.css';
import style from './edss.module.css';
import { clearEDSSCalc } from '../../redux/actions/edss';
import { addError } from '../../redux/actions/error'
import { alterDataCall } from '../../redux/actions/addOrUpdateData';

@connect(state => ({
    edssCalc: state.edssCalc,
    visitFields: state.availableFields.visitFields,
    patientProfile: state.patientProfile.data,
    sections : state.availableFields.visitSections
}))
export default class EDSSPage extends Component {
    render() {
        if (this.props.patientProfile.visits) {
            const { edssCalc, visitFields, patientProfile, sections, match} = this.props;
            return <EDSSCalculator match={match} edssCalc={edssCalc} visitFields={visitFields} patientProfile={patientProfile} sections={sections}/>;
        } else {
            return null;
        }
    }
}
class EDSSCalculator extends Component {
    constructor() {
        super();
        this.state = { autoCalculatedScore: 0, redirect: false };
        this._handleClick = this._handleClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {    //this basically adds the originalValues and EDSSFields
        const { visitFields, sections, patientProfile, match } = this.props;
        const { params } = match;
        const EDSSFields = visitFields.filter(el => el.subsection === 'QS');
        if (EDSSFields.length !== 9){
            store.dispatch(addError({ error: 'EDSS should have 9 entries in the database! please contact your admin' }));
            this.setState({ redirect: true });
        }
        this.EDSSFields = EDSSFields;    //the 9 fields of edss
        this.EDSSFields_Hash = EDSSFields.reduce((a, el) => { a[el.id] = el.idname; return a; }, {});
        this.EDSSFields_Hash_reverse = EDSSFields.reduce((a, el) => { a[el.idname] = el.id; return a; }, {});
        // console.log(this.EDSSFields, this.EDSSFields_Hash, this.EDSSFields_Hash_reverse);
        const edssFieldsId = EDSSFields.map(el => el.id);
        const visitsFiltered = patientProfile.visits.filter(el => el.id === parseInt(params.visitId));
        if (visitsFiltered.length !== 1) {
            store.dispatch(addError({ error: 'Cannot find your visit' }));
            this.setState({ redirect: true });
        }
        const ambulationID = this.EDSSFields_Hash_reverse.Expanded_Disability_Status_Scale_EDSS_Ambulation;
        console.log(ambulationID);
        const data = visitsFiltered[0].data;
        let orignalValuesWithoutAmbulation = [];
        let ambulation;
        if (data) {
            this.originalValues = data.filter(el => edssFieldsId.includes(el.field)).reduce((a, el) => { a[el.field] = parseInt(el.value); return a; }, {});
            const tmpValues = {...this.originalValues};
            console.log('TMP', tmpValues, tmpValues[ambulationID]);
            if (typeof tmpValues[ambulationID] !== undefined) {
                ambulation = parseInt(tmpValues[ambulationID]);
                delete tmpValues[ambulationID];
            }
            orignalValuesWithoutAmbulation = Object.values(tmpValues);
        } else {
            this.originalValues = {};
        }
        console.log('ORIGINAL', this.originalValues);
        console.log('AMBULATION', ambulation);
        this.setState({ autoCalculatedScore: edssAlgorithm(orignalValuesWithoutAmbulation, ambulation) });
        this.forceUpdate();
    }

    _handleClick(ev) {
        ev.target.nextSibling.checked = true;
        const value = ev.target.nextSibling.value;
        const radioGroup = ev.target.parentElement.parentElement.children;
        // console.log(radioGroup);
        for (let i = 0; i < radioGroup.length; i++) {
            let button = radioGroup[i].children[0];
            let buttonvalue = button.value;  //value of the button; children[0] is <button> and [1] is <input>
            // console.log(button, buttonvalue);
            if (value === buttonvalue) {
                button.classList.add(style.radioClicked);
            } else {
                if (button.classList.contains(style.radioClicked)) {
                    button.classList.remove(style.radioClicked);
                } else {
                    continue;
                }
            }
        }
        /* auto calculate the score */
        if (!document.querySelector('input[name="Expanded_Disability_Status_Scale_EDSS_Ambulation"]:checked')) {
            this.setState({ autoCalculatedScore: 'Ambulation score must be provided.' });
            return;
        }
        const criteria = [
            'Expanded_Disability_Status_Scale_EDSS_Pyramidal',
            'Expanded_Disability_Status_Scale_EDSS_Cerebellar',
            'Expanded_Disability_Status_Scale_EDSS_Brain_Stem',
            'Expanded_Disability_Status_Scale_EDSS_Sensory',
            'Expanded_Disability_Status_Scale_EDSS_Bowel_Bladder',
            'Expanded_Disability_Status_Scale_EDSS_Bowel_Visual',
            'Expanded_Disability_Status_Scale_EDSS_Mental'
        ];
        let scoreArr = [];
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {
                scoreArr.push(parseInt(document.querySelector(`input[name="${each}"]:checked`).value));
            }
        }
        this.setState({ autoCalculatedScore: edssAlgorithm(scoreArr, parseInt(document.querySelector('input[name="Expanded_Disability_Status_Scale_EDSS_Ambulation"]:checked').value)) });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const criteria = [
            'Expanded_Disability_Status_Scale_EDSS_Pyramidal',
            'Expanded_Disability_Status_Scale_EDSS_Cerebellar',
            'Expanded_Disability_Status_Scale_EDSS_Brain_Stem',
            'Expanded_Disability_Status_Scale_EDSS_Sensory',
            'Expanded_Disability_Status_Scale_EDSS_Bowel_Bladder',
            'Expanded_Disability_Status_Scale_EDSS_Bowel_Visual',
            'Expanded_Disability_Status_Scale_EDSS_Mental',
            'Expanded_Disability_Status_Scale_EDSS_Ambulation'
        ];
        const add = {};
        const update = {};
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {    //if anything is checked
                console.log('CHECL', this.originalValues[this.EDSSFields_Hash_reverse[each]], each, this.EDSSFields_Hash_reverse[each], typeof this.originalValues[this.EDSSFields_Hash_reverse[each]], typeof this.originalValues[this.EDSSFields_Hash_reverse[each]] !== undefined);
                if (typeof this.originalValues[this.EDSSFields_Hash_reverse[each]] !== 'undefined') {  //if there's original value
                    if (this.originalValues[this.EDSSFields_Hash_reverse[each]] !==  parseInt(document.querySelector(`input[name="${each}"]:checked`).value)) {
                        update[this.EDSSFields_Hash_reverse[each]] = document.querySelector(`input[name="${each}"]:checked`).value;
                    }
                } else {
                    add[this.EDSSFields_Hash_reverse[each]] = document.querySelector(`input[name="${each}"]:checked`).value;
                }
            }
        }
        const body = { data: {add, update, visitId: this.props.match.params.visitId }, patientId: this.props.match.params.patientId, type: 'visit'};
        console.log(body);
        store.dispatch(alterDataCall(body));
    }

    render() {
        if (!this.originalValues || !this.EDSSFields_Hash_reverse) return null;
        const { params } = this.props.match;
        const { EDSSFields_Hash_reverse, originalValues } = this;
        const rangeGen = ceiling => [...Array(ceiling).keys()];  //returns [0,1,2,3,...,*ceiling_inclusive*]
        const range_pyramidal = rangeGen(6);
        const range_cerebellar = rangeGen(5);
        const range_brainstem = rangeGen(5);
        const range_sensory = rangeGen(6);
        const range_bowelbladder = rangeGen(6);
        const range_visual = rangeGen(6);
        const range_mental = rangeGen(5);
        const range_ambulation = rangeGen(12);
        const criteria = [
            { name: 'Pyramidal', idname: 'Expanded_Disability_Status_Scale_EDSS_Pyramidal', range: range_pyramidal },
            { name: 'Cerebellar', idname: 'Expanded_Disability_Status_Scale_EDSS_Cerebellar', range: range_cerebellar },
            { name: 'Brain stem', idname: 'Expanded_Disability_Status_Scale_EDSS_Brain_Stem', range: range_brainstem },
            { name: 'Sensory', idname: 'Expanded_Disability_Status_Scale_EDSS_Sensory', range: range_sensory },
            { name: 'Bowel bladder', idname: 'Expanded_Disability_Status_Scale_EDSS_Bowel_Bladder', range: range_bowelbladder },
            { name: 'Visual', idname: 'Expanded_Disability_Status_Scale_EDSS_Bowel_Visual', range: range_visual },
            { name: 'Mental', idname: 'Expanded_Disability_Status_Scale_EDSS_Mental', range: range_mental },
            { name: 'Ambulation', idname: 'Expanded_Disability_Status_Scale_EDSS_Ambulation', range: range_ambulation }
        ];
        return (
            <div className={style_scaffold.errorMessage}>
                <div className={style_scaffold.edssCalcBox}>
                    <div className={style.title}>
                        <h3>Expanded Disability Status Scale</h3>
                        <Link to={`/patientProfile/${params.patientId}/edit/msPerfMeas/${params.visitId}`}><span className={style.cancelButton}>&#10006;</span></Link>
                    </div>
                    <div className={style.calculator}>
                        <form onSubmit={this._handleSubmit}>
                            {criteria.map(el =>
                                <div className={style.criterion} key={el.name}>
                                    <span>{`${el.name} :  `}</span>
                                    <div>
                                        {el.range.map(number =>
                                            <span key={number} className={style.radioButtonWrapper}>
                                                <button type='button'
                                                    className={typeof originalValues[EDSSFields_Hash_reverse[el.idname]] !== 'undefined' && number === parseInt(this.originalValues[this.EDSSFields_Hash_reverse[el.idname]]) ? [style.radioButton, style.radioClicked].join(' ') : style.radioButton }
                                                    onClick={this._handleClick}
                                                    value={number}
                                                >{number}</button>
                                                <input type='radio' name={el.idname} value={number} defaultChecked={typeof originalValues[EDSSFields_Hash_reverse[el.idname]] !== 'undefined' && number === parseInt(this.originalValues[this.EDSSFields_Hash_reverse[el.idname]]) ? true : false }/>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <br/>
                            <span><b>Suggested score for reference: </b></span> <input type='text' value={this.state.autoCalculatedScore} readOnly/>
                            <br/><br/>
                            <span><b>Free input score: </b></span> <input name='Expanded_Disability_Status_Scale_EDSS_total' type='text'/>
                            <br/><br/>
                            <input type='submit' value='Save'/>
                        </form>
                        <br /><br /><br />
                    </div>
                    <div className={style.guideline}>
                        <h4> EDSS Guideline </h4> <br />
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."\
                    </div>
                </div>
            </div>
        );
    }
}


/* FSArray would be [1,1,2,0,6] etc; ambulation is separated because it's separate in the calculation */  
function edssAlgorithm(FSArrayWithoutAmbulation, ambulationScore){
    FSArrayWithoutAmbulation.sort((a, b) => b - a);
    console.log('FSArray', FSArrayWithoutAmbulation);
    const maxScore = FSArrayWithoutAmbulation[0] || 0;
    const secondMaxScore = FSArrayWithoutAmbulation[1] || 0;
    const countHash = FSArrayWithoutAmbulation.reduce((hash, el) => {
        if (hash[el]) hash[el]++;
        else hash[el] = 1;
        return hash;
    }, {});

    //just some crude error checking
    if (maxScore > 5) {
        return 'edss function system scores are incorrect.';
    }

    const ambulationMap = {
        12: 8,
        11: 7.5,
        10: 7,
        9: 6.5,
        8: 6.5,
        7: 6,
        6: 6,
        5: 6,
        4: 5.5
    };
    if (ambulationMap[ambulationScore]) {
        return ambulationMap[ambulationScore];
    }
    switch (ambulationScore) {
        case 3:
            if (maxScore === 5)
                return 5;
            if (maxScore === 6)
                return 6;
            if (maxScore === 4 && countHash[4] >= 2)
                return 5;
            if (maxScore === 3 && countHash[3] >= 6)
                return 5;
            return 4;
        case 2:
            if (maxScore > 4) {
                return maxScore - 1;
            }
            if (maxScore === 4 && countHash[4] === 1 && secondMaxScore === 3 && countHash[3] <= 2)
                return 4.5;
            if (maxScore === 3 && countHash[3] > 5)
                return 4.5;
            return 4;
        case 1:
        case 0:
            switch (maxScore) {
                case 0:
                    return 0;
                case 1:
                    if (countHash[1] > 1) {
                        return 1.5;
                    } else {
                        return 1;
                    }
                case 2:
                    if (countHash[2] > 1) {
                        return 2.5;
                    } else {
                        return 2;
                    }
                case 3:
                    if (countHash[3] === 1) {
                        if ([0,1].includes(secondMaxScore)) {
                            return 3;
                        } else {
                            return 3.5;
                        }
                    } else {
                        return 3.5;
                    }
                case 4:
                    return 4;
                default:
                    return 5;
            }
        default:
            return 'Ambulation score must be provided.';
    }
}