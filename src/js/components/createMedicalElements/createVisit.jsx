import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import { PickDate } from './datepicker';
import style from './medicalEvent.module.css';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    demographicData: state.patientProfile.data.demographicData
}), dispatch => ({ createVisit: body => dispatch(createVisitAPICall(body)) }))
export class CreateVisit extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            SBP: '',
            DBP: '',
            HR: '',
            weight: '',
            academicConcerns: '0',
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
        const date = this.state.startDate;
        const { SBP, DBP, HR, weight, academicConcerns, height } = this.state;

        if (!parseInt(SBP, 10)) {
            return 'systolic blood pressure';
        }
        if (!parseInt(DBP, 10)) {
            return 'diastolic blood pressure';
        }
        if (!parseInt(HR, 10)) {
            return 'heart rate';
        }

        return {
            visitData: {
                patientId: this.props.patientId,
                visitDate: date.toISOString()
            },
            VSData: {
                add: {
                    1: parseInt(SBP),
                    2: parseInt(HR),
                    3: parseInt(DBP),
                    4: isNaN(height) ? parseInt(height) : undefined,
                    5: isNaN(weight) ? parseInt(weight) : undefined,
                    6: parseInt(academicConcerns)
                }
            },
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick(ev) {
        ev.preventDefault();
        let error = this._formatRequestBody();
        if (typeof error === 'string') {
            this.setState({ error: `Please enter ${error} (integer)` });
            return;
        }
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        this.props.createVisit(requestBody);
    }

    render() {
        if (this.props.demographicData === undefined)
            return null;
        const { startDate, SBP, DBP, HR, weight, academicConcerns, height, error } = this.state;
        const { params } = this.props.match;
        const { demographicData } = this.props;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Create a new Visit</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <label>Please enter date on which the visit occured:</label><br /><PickDate startDate={startDate} handleChange={this._handleDateChange} /><br /><br />
                    <label htmlFor='SBP'>Systolic blood pressure (mmHg):</label><br /> <input name='SBP' value={SBP} onChange={this._handleKeyChange} autoComplete='off' /><br /><br />
                    <label htmlFor='DBP'>Diastolic blood pressure (mmHg):</label><br /> <input name='DBP' value={DBP} onChange={this._handleKeyChange} autoComplete='off' /><br /><br />
                    <label htmlFor='HR'>Heart rate (bpm):</label><br /> <input name='HR' value={HR} onChange={this._handleKeyChange} autoComplete='off' /><br /><br />
                    <label htmlFor='weight'>Weight (kg):</label><br /> <input name='weight' value={weight} onChange={this._handleKeyChange} autoComplete='off' /><br /><br />
                    <label htmlFor='height'>Height (cm):</label><br /> <input name='height' value={height} onChange={this._handleKeyChange} autoComplete='off' /><br /><br />
                    {new Date().getTime() - parseInt(demographicData.DOB) < 568025136000 ?
                        <>
                            <label htmlFor='academicConcerns'>Academic concerns:</label><br />
                            <select
                                name='academicConcerns'
                                onChange={this._handleKeyChange}
                                value={academicConcerns}
                                autoComplete='off'
                            >
                                <option value='1'>Yes</option>
                                <option value='0'>No</option>
                            </select><br /><br />
                        </>
                        : null}
                    <button onClick={this._handleSubmitClick} >Submit</button>
                    {error ? <><br /><br /><div className={style.error}>{error}</div></> : null}
                </form>
            </>
        );
    }
}