import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../../redux/store';
import style_scaffold from '../scaffold/scaffold.module.css';
import style from './edss.module.css';
import { clearEDSSCalc } from '../../redux/actions/edss';

@connect(state => ({ edssCalc: state.edssCalc }))
export default class EDSSCalculator extends Component {
    constructor() {
        super();
        this.state = { autoCalculatedScore: 0 };
        this._handleClick = this._handleClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
    }

    _handleCancel() {
        store.dispatch(clearEDSSCalc());
    }

    _handleClick(ev) {
        ev.target.nextSibling.checked = true;
        const value = ev.target.nextSibling.value;
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
        const criteria = ['Pyramidal', 'Cerebellar', 'Brain stem', 'Sensory', 'Bowel bladder', 'Visual', 'Mental', 'Ambulation'];
        let scoreSum = 0;
        for (let each of criteria) {
            if (document.querySelector(`input[name="${each}"]:checked`)) {
                scoreSum += parseInt(document.querySelector(`input[name="${each}"]:checked`).value);
            }
        }
        this.setState({ autoCalculatedScore: scoreSum });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        console.log(ev.target);
    }

    render() {
        const { params } = this.props.match;
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
            { name: 'Ambulation', range: range_ambulation }
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
                                                <button
                                                    className={style.radioButton}
                                                    onClick={this._handleClick}
                                                    value={number}
                                                >{number}</button>
                                                <input type='radio' name={el.name} value={number} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <br />
                            <span><b>Calculated score: </b></span> <input type='text' value={this.state.autoCalculatedScore} />
                            <br /><br />
                            <span><b>Free input score: </b></span> <input type='text' />
                            <br /><br />
                            <input type='submit' value='Save' />
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