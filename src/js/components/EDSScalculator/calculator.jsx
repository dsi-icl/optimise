import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../../redux/store';
import style_scaffold from '../scaffold/scaffold.module.css';
import style from './edss.module.css';
import { clearEDSSCalc } from '../../redux/actions/edss';
import { max } from '../../../../node_modules/moment';

@connect(state => ({ edssCalc: state.edssCalc }))
export class EDSSCalculator extends Component {
    constructor() {
        super();
        this.state = { autoCalculatedScore: 0 };
        this._handleClick = this._handleClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
    }

    _handleCancel(){
        store.dispatch(clearEDSSCalc());
    }

    _handleClick(ev) {
        ev.target.nextSibling.checked = true;
        const value  = ev.target.nextSibling.value;
        const radioGroup = ev.target.parentElement.parentElement.children;
        console.log(radioGroup);
        for (let i = 0; i < radioGroup.length; i++) {
            let button = radioGroup[i].children[0];
            let buttonvalue = button.value;  //value of the button; children[0] is <button> and [1] is <input>
            console.log(button, buttonvalue);
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
        if (!document.querySelector('input[name="Ambulation"]:checked')) {
            this.setState({ autoCalculatedScore: 'Ambulation score must be provided.' });
            return;
        }
        const criteria = ['Pyramidal', 'Cerebellar', 'Brain stem', 'Sensory', 'Bowel bladder', 'Visual', 'Mental'];
        let scoreArr = [];
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {
                scoreArr.push(parseInt(document.querySelector(`input[name="${each}"]:checked`).value));
            }
        }
        this.setState({ autoCalculatedScore: edssAlgorithm(scoreArr, parseInt(document.querySelector('input[name="Ambulation"]:checked').value)) });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        console.log(ev.target);
    }

    render() {
        const { edssCalc } = this.props;
        if (!edssCalc.display) {
            return null;
        }
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
            { name: 'Pyramidal', range: range_pyramidal },
            { name: 'Cerebellar', range: range_cerebellar },
            { name: 'Brain stem', range: range_brainstem },
            { name: 'Sensory', range: range_sensory },
            { name: 'Bowel bladder', range: range_bowelbladder },
            { name: 'Visual', range: range_visual },
            { name: 'Mental', range: range_mental },
            { name: 'Ambulation', range: range_ambulation}
        ];
        return (
            <div className={style_scaffold.errorMessage}>
                <div className={style_scaffold.edssCalcBox}>
                    <div className={style.title}>
                        <h3>Expanded Disability Status Scale</h3>
                        <span onClick={this._handleCancel} className={style.cancelButton}>&#10006;</span>
                    </div>
                    <div className={style.calculator}>
                        <form onSubmit={this._handleSubmit}>
                            {criteria.map(el =>
                                <div className={style.criterion} key={el.name}>
                                    <span>{`${el.name} :  `}</span>
                                    <div>
                                        {el.range.map(number =>
                                            <span key={number} className={style.radioButtonWrapper}>
                                                <button
                                                    className={style.radioButton}
                                                    onClick={this._handleClick}
                                                    value={number}
                                                >{number}</button>
                                                <input type='radio' name={el.name} value={number}/>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <br/>
                            <span><b>Suggested score for reference: </b></span> <input type='text' value={this.state.autoCalculatedScore}/>
                            <br/><br/>
                            <span><b>Free input score: </b></span> <input type='text'/>
                            <br/><br/>
                            <input type='submit' value='Save'/>
                        </form>
                        <br/><br/><br/>
                    </div>
                    <div className={style.guideline}>
                        <h4> EDSS Guideline </h4> <br/>
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