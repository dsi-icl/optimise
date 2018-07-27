import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/dataPage';
import Helmet from '../scaffold/helmet';
import store from '../../redux/store';
import style from './edss.module.css';
import { clearEDSSCalc } from '../../redux/actions/edss';

@connect(state => ({
    data: state.patientProfile.data,
    edssCalc: state.edssCalc
}))
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
    }

    render() {
        const { match: { params }, data: { visits } } = this.props;
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

        if (visits === undefined)
            return null;

        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Performance Measures' />
                    <h2>Performance Measurese Calculator ({this.props.match.params.patientId})</h2>
                    <BackButton to={`/patientProfile/${this.props.match.params.patientId}/edit/msPerfMeas/${params.visitId}`} />
                </div>
                <div className={style.panel}>
                    <div className={style.calculatorArea}>
                        <span>
                            <i>This is the EDSS performance score calculator for visit of the {(new Date(parseInt(visits[params.visitId].visitDate))).toDateString()}</i><br /><br />
                            Below the help calculator will automatically compoute a score for you, however, you are free to indicate immediately a custom score</span><br /><br /><br />
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
                            <span><label htmlFor='calcSocre'>Calculated score: </label></span> <input type='text' name='calcSocre' value={this.state.autoCalculatedScore} />
                            <br /><br />
                            <span><label htmlFor='freeSocre'>Free input score: </label></span> <input type='text' name='freeSocre' />
                            <br /><br />
                            <button type='submit'>Save</button>
                        </form>
                    </div>
                    <div className={style.contextArea}>
                    </div>
                </div>
            </>
        );
    }
}