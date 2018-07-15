import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/dataPage';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import { PickDate } from './datepicker';
import style from './medicalEvent.module.css';

@connect(state => ({ patientId: state.patientProfile.data.id }), dispatch => ({ createVisit: body => dispatch(createVisitAPICall(body)) }))
export class CreateVisit extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            SBP: '',
            DBP: '',
            HR: '',
            weight: '',
            academicConcern: '0',
            height: '',
            error: false
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleKeyChange = this._handleKeyChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleKeyChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        const { SBP, DBP, HR, weight, academicConcern, height } = this.state;
        for (let each of [SBP, DBP, HR, weight, height]) {
            if (!parseInt(each, 10)) {
                return false;
            }
        }
        return {
            visitData: {
                patientId: this.props.patientId,
                visitDate: date.toDateString()
            },
            VSData: {
                add: {
                    1: parseInt(SBP),
                    2: parseInt(HR),
                    3: parseInt(DBP),
                    4: parseInt(height),
                    5: parseInt(weight),
                    6: parseInt(academicConcern)
                }
            },
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick() {
        if (!this._formatRequestBody()) {
            this.setState({ error: true });
            return;
        }
        const requestBody = this._formatRequestBody();
        this.props.createVisit(requestBody);
    }

    render() {
        const { startDate, SBP, DBP, HR, weight, academicConcern, height, error } = this.state;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Create a new Visit</h2>
                    <BackButton to={`/patientProfile/${this.props.patientId}`} />
                </div>
                <form className={style.panel}>
                    <label>Please enter date on which the visit occured:</label><br /><PickDate startDate={startDate} handleChange={this._handleDateChange} /><br /><br />
                    <label htmlFor='SBP'>Systolic blood pressure (mmHg):</label><br /> <input name='SBP' value={SBP} onChange={this._handleKeyChange} /><br /><br />
                    <label htmlFor='DBP'>Diastolic blood pressure (mmHg):</label><br /> <input name='DBP' value={DBP} onChange={this._handleKeyChange} /><br /><br />
                    <label htmlFor='HR'>Heart rate (bpm):</label><br /> <input name='HR' value={HR} onChange={this._handleKeyChange} /><br /><br />
                    <label htmlFor='weight'>Weight (kg):</label><br /> <input name='weight' value={weight} onChange={this._handleKeyChange} /><br /><br />
                    <label htmlFor='height'>Height (cm):</label><br /> <input name='height' value={height} onChange={this._handleKeyChange} /><br /><br />
                    <label htmlFor='academicConcern'>Academic concern:</label><br />
                    <select name='academicConcern' onChange={this._handleKeyChange} value={academicConcern}>
                        <option value='1'>true</option>
                        <option value='0'>false</option>
                    </select><br /><br />
                    <button onClick={this._handleSubmitClick} >Submit</button>
                    {error ? <><br /><br /><div className={style.error}> Please only provide integers! </div></> : null}
                </form>
            </>
        );
    }
}