import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import { PickDate } from './datepicker';
import style from './medicalEvent.module.css';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    agentId: state.syncInfo.config.id,
    }), dispatch => ({
        createVisit: body => dispatch(createVisitAPICall(body))
        }))
class CreateVisit extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            reasonForVisit: 'unselected',
            error: false
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleKeyChange = this._handleKeyChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: false
        });
    }

    _handleKeyChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        newState.error = false;
        this.setState(newState);
    }

    _formatRequestBody() {
        const { startDate, reasonForVisit } = this.state;

        if (!startDate || !startDate.isValid()) {
            return 'the date of the visit';
        }
        if (reasonForVisit === 'unselected') {
            return 'the reason for the visit';
        }

        return {
            visitData: {
                patientId: this.props.patientId,
                visitDate: startDate.toISOString()
            },
            VSData: {
                add: {
                    0: reasonForVisit.trim()
                }
            },
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        let error = this._formatRequestBody();
        if (typeof error === 'string') {
            this.setState({ error: `Please enter ${error}` });
            return;
        }

        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        requestBody.agentId = this.props.agentId;

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            this.props.createVisit(requestBody);
        });
    }

    render() {
        const { startDate, reasonForVisit, error } = this.state;
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Create a new Visit</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <label>Please enter date on which the visit occured:</label><br /><PickDate startDate={startDate} handleChange={this._handleDateChange} /><br /><br />
                    <label htmlFor='reasonForVisit'>Reason for the visit:</label><br />
                    <select name='reasonForVisit'
                        onChange={this._handleKeyChange}
                        value={reasonForVisit}
                        autoComplete='off'
                    >
                        <option value='unselected'></option>
                        <option value='Routine'>Routine</option>
                        <option value='Drug Monitoring'>Drug Monitoring</option>
                        <option value='Relapse Assessment'>Relapse Assessment</option>
                        <option value='Urgent'>Urgent</option>
                    </select><br /><br />
                    {error ? <><div className={style.error}>{error}</div><br /></> : null}
                    <button onClick={this._handleSubmitClick} >Submit</button>
                </form>
            </>
        );
    }
}

export { CreateVisit };