import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/dataPage';
import Helmet from '../scaffold/helmet';
import store from '../../redux/store';
import style from './edss.module.css';
import { addError } from '../../redux/actions/error';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';

@connect(state => ({
    edssCalc: state.edssCalc,
    visitFields: state.availableFields.visitFields,
    patientProfile: state.patientProfile.data,
    sections: state.availableFields.visitSections
}))
export default class EDSSPage extends Component {
    render() {
        if (this.props.patientProfile.visits) {
            const { edssCalc, visitFields, patientProfile, sections, match } = this.props;
            return <EDSSCalculator match={match} edssCalc={edssCalc} visitFields={visitFields} patientProfile={patientProfile} sections={sections} />;
        } else {
            return null;
        }
    }
}
class EDSSCalculator extends Component {
    constructor() {
        super();
        this.state = { autoCalculatedScore: 0, redirect: false };
        this.freeinputref = React.createRef();
        this._hoverType = this._hoverType.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {    //this basically adds the originalValues and EDSSFields
        const { visitFields, patientProfile, match } = this.props;
        const { params } = match;
        const EDSSFields = visitFields.filter(el => /^edss:(.*)/.test(el.idname));
        if (EDSSFields.length !== 9) {
            store.dispatch(addError({ error: 'EDSS should have 9 entries in the database! please contact your admin' }));
            this.setState({ redirect: true });
        }
        this.EDSSFields = EDSSFields;    //the 9 fields of edss
        this.EDSSFields_Hash = EDSSFields.reduce((a, el) => { a[el.id] = el.idname; return a; }, {});
        this.EDSSFields_Hash_reverse = EDSSFields.reduce((a, el) => { a[el.idname] = el.id; return a; }, {});
        const edssFieldsId = EDSSFields.map(el => el.id);
        const visitsFiltered = patientProfile.visits.filter(el => el.id === parseInt(params.visitId));
        if (visitsFiltered.length !== 1) {
            store.dispatch(addError({ error: 'Cannot find your visit' }));
            this.setState({ redirect: true });
        }
        const ambulationID = this.EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) ambulation'];
        const data = visitsFiltered[0].data;
        let orignalValuesWithoutAmbulation = [];
        let ambulation;
        if (data) {
            this.originalValues = data.filter(el => edssFieldsId.includes(el.field)).reduce((a, el) => { a[el.field] = parseFloat(el.value); return a; }, {});
            const tmpValues = { ...this.originalValues };
            if (typeof tmpValues[ambulationID] !== undefined) {
                ambulation = parseFloat(tmpValues[ambulationID]);
                delete tmpValues[ambulationID];
            }
            orignalValuesWithoutAmbulation = Object.values(tmpValues);
        } else {
            this.originalValues = {};
        }
        this.setState({ autoCalculatedScore: edssAlgorithm(orignalValuesWithoutAmbulation, ambulation) });
        this.forceUpdate();
    }

    _handleClick(ev) {
        ev.target.nextSibling.checked = true;
        const value = ev.target.nextSibling.value;
        const radioGroup = ev.target.parentElement.parentElement.children;
        for (let i = 0; i < radioGroup.length; i++) {
            let button = radioGroup[i].children[0];
            let buttonvalue = button.value;  //value of the button; children[0] is <button> and [1] is <input>
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
        if (!document.querySelector('input[name="edss:expanded disability status scale (edss) ambulation"]:checked')) {
            this.setState({ autoCalculatedScore: 'Ambulation score must be provided.' });
            return;
        }
        const criteria = [
            'edss:expanded disability status scale (edss) pyramidal',
            'edss:expanded disability status scale (edss) cerebellar',
            'edss:expanded disability status scale (edss) brain stem',
            'edss:expanded disability status scale (edss) sensory',
            'edss:expanded disability status scale (edss) bowel bladder',
            'edss:expanded disability status scale (edss) visual',
            'edss:expanded disability status scale (edss) mental'
        ];
        let scoreArr = [];
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {
                scoreArr.push(parseFloat(document.querySelector(`input[name="${each}"]:checked`).value));
            }
        }
        this.setState({ autoCalculatedScore: edssAlgorithm(scoreArr, parseFloat(document.querySelector('input[name="edss:expanded disability status scale (edss) ambulation"]:checked').value)) });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const criteria = [
            'edss:expanded disability status scale (edss) pyramidal',
            'edss:expanded disability status scale (edss) cerebellar',
            'edss:expanded disability status scale (edss) brain stem',
            'edss:expanded disability status scale (edss) sensory',
            'edss:expanded disability status scale (edss) bowel bladder',
            'edss:expanded disability status scale (edss) visual',
            'edss:expanded disability status scale (edss) mental',
            'edss:expanded disability status scale (edss) ambulation',
        ];
        const add = {};
        const update = {};
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {    //if anything is checked
                if (typeof this.originalValues[this.EDSSFields_Hash_reverse[each]] !== 'undefined') {  //if there's original value
                    if (this.originalValues[this.EDSSFields_Hash_reverse[each]] !== parseFloat(document.querySelector(`input[name="${each}"]:checked`).value)) {
                        update[this.EDSSFields_Hash_reverse[each]] = document.querySelector(`input[name="${each}"]:checked`).value;
                    }
                } else {
                    add[this.EDSSFields_Hash_reverse[each]] = document.querySelector(`input[name="${each}"]:checked`).value;
                }
            }
        }

        /* for the free input */
        const freeInputOrigVal = this.originalValues[this.EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) total']];
        if (freeInputOrigVal !== undefined) {
            if (this.freeinputref.current.value !== freeInputOrigVal) {
                update[this.EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) total']] = this.freeinputref.current.value;
            }
        } else {
            if (this.freeinputref.current.value !== '') {
                add[this.EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) total']] = this.freeinputref.current.value;
            }
        }

        const body = { data: { add, update, visitId: this.props.match.params.visitId }, patientId: this.props.match.params.patientId, type: 'visit' };
        store.dispatch(alterDataCall(body));
    }

    _hoverType(id, number) {
        if (id)
            this.setState({
                currentHoverMeasure: id
            });
        else
            this.setState({
                currentHoverPower: number
            });
    }

    render() {
        if (!this.originalValues || !this.EDSSFields_Hash_reverse || !this.EDSSFields) return null;
        const { match: { params }, patientProfile: { visits } } = this.props;
        const { EDSSFields_Hash_reverse, originalValues, EDSSFields } = this;
        const rangeGen = ceiling => [...Array(ceiling).keys()];  //returns [0,1,2,3,...,*ceiling_inclusive*]
        const range_pyramidal = rangeGen(7);
        const range_cerebellar = rangeGen(6);
        const range_brainstem = rangeGen(6);
        const range_sensory = rangeGen(7);
        const range_bowelbladder = rangeGen(7);
        const range_visual = rangeGen(7);
        const range_mental = rangeGen(6);
        const range_ambulation = rangeGen(13);
        const criteria = [
            { name: 'Pyramidal', idname: 'edss:expanded disability status scale (edss) pyramidal', range: range_pyramidal },
            { name: 'Cerebellar', idname: 'edss:expanded disability status scale (edss) cerebellar', range: range_cerebellar },
            { name: 'Brain stem', idname: 'edss:expanded disability status scale (edss) brain stem', range: range_brainstem },
            { name: 'Sensory', idname: 'edss:expanded disability status scale (edss) sensory', range: range_sensory },
            { name: 'Bowel bladder', idname: 'edss:expanded disability status scale (edss) bowel bladder', range: range_bowelbladder },
            { name: 'Visual', idname: 'edss:expanded disability status scale (edss) visual', range: range_visual },
            { name: 'Mental', idname: 'edss:expanded disability status scale (edss) mental', range: range_mental },
            { name: 'Ambulation', idname: 'edss:expanded disability status scale (edss) ambulation', range: range_ambulation }
        ];

        if (visits === undefined)
            return null;

        const visitFiltered = visits.filter(el => parseInt(params.visitId) === el.id);
        if (visitFiltered.length !== 1) {
            return <div> Cannot find your visit </div>;
        }

        const currentEDSSObject = EDSSFields.reduce((a, el) => { a[el.id] = el; return a; }, {})[this.state.currentHoverMeasure];

        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Performance Measures' />
                    <h2>Performance Measurese Calculator ({this.props.match.params.patientId})</h2>
                    <BackButton to={`/patientProfile/${this.props.match.params.patientId}/edit/msPerfMeas/${params.visitId}`} />
                </div>
                <div className={style.panel}>
                    <form onSubmit={this._handleSubmit}>
                        <span><i>This is the EDSS performance score calculator for visit of the {(new Date(parseInt(visitFiltered[0].visitDate))).toDateString()}</i><br /><br />
                            Below the help calculator will automatically compoute a score for you, however, you are free to indicate immediately a custom score</span><br /><br />
                        <div className={style.calculatorArea}>
                            {criteria.map(el =>
                                <div className={style.criterion} key={el.name} onMouseOver={() => this._hoverType(EDSSFields_Hash_reverse[el.idname])} onMouseLeave={() => this._hoverType(null)}>
                                    <span>{`${el.name} :  `}</span>
                                    <div>
                                        {el.range.map(number =>
                                            <span key={number} className={style.radioButtonWrapper}>
                                                <button type='button'
                                                    className={typeof originalValues[EDSSFields_Hash_reverse[el.idname]] !== 'undefined' && number === parseFloat(this.originalValues[this.EDSSFields_Hash_reverse[el.idname]]) ? [style.radioButton, style.radioClicked].join(' ') : style.radioButton}
                                                    onClick={this._handleClick}
                                                    onMouseOver={() => this._hoverType(null, number)}
                                                    value={number}
                                                >{number}</button>
                                                <input type='radio' name={el.idname} value={number} defaultChecked={typeof originalValues[EDSSFields_Hash_reverse[el.idname]] !== 'undefined' && number === parseFloat(this.originalValues[this.EDSSFields_Hash_reverse[el.idname]]) ? true : false} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={style.contextArea}>
                            {this.state.currentHoverMeasure ? currentEDSSObject.labels.split('@').map((e, i) => (
                                <Fragment key={i}>
                                    <span className={this.state.currentHoverPower === i ? style.currentHoverPower : ''}>{i}. {e}</span><br />
                                </Fragment>
                            )) : null}
                        </div>
                        <br /><br />
                        <label htmlFor='calcSocre'>Calculated score (automatically generated): </label><input type='text' name='calcSocre' value={this.state.autoCalculatedScore} readOnly />
                        <br /><br />
                        <label htmlFor='edss:expanded disability status scale (edss) total'>Estimated score (entered by user): </label><input type='text' ref={this.freeinputref} name='edss:expanded disability status scale (edss) total' defaultValue={originalValues[EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) total']] ? originalValues[EDSSFields_Hash_reverse['edss:expanded disability status scale (edss) total']] : ''} />
                        <br /><br />
                        <button type='submit'>Save</button>
                    </form>
                </div>
            </>
        );
    }
}


/* FSArray would be [1,1,2,0,6] etc; ambulation is separated because it's separate in the calculation */
function edssAlgorithm(FSArrayWithoutAmbulation, ambulationScore) {
    FSArrayWithoutAmbulation.sort((a, b) => b - a);
    const maxScore = FSArrayWithoutAmbulation[0] || 0;
    const secondMaxScore = FSArrayWithoutAmbulation[1] || 0;
    const countHash = FSArrayWithoutAmbulation.reduce((hash, el) => {
        if (hash[el]) hash[el]++;
        else hash[el] = 1;
        return hash;
    }, {});

    //just some crude error checking
    if (maxScore > 6) {
        return 'EDSS function system scores are incorrect';
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
                        if ([0, 1].includes(secondMaxScore)) {
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
            return 'Ambulation score must be provided';
    }
}