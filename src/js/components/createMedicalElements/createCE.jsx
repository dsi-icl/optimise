import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createCEAPICall } from '../../redux/actions/clinicalEvents';
import { SuggestionInput } from '../meDRA/meDRApicker';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
@connect(state => ({ patientId: state.patientProfile.data.id, visits: state.patientProfile.data.visits, types: state.availableFields.clinicalEventTypes, meddra: state.meddra.result }), dispatch => ({ createCE: body => dispatch(createCEAPICall(body)) }))
export class CreateCE extends Component {
    constructor() {
        super();
        this.state = {
            noEndDate: true,
            endDate: moment(),
            startDate: moment(),
            ceType: 'unselected',
            meddra: React.createRef()
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            endDate: date
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            ceType: ev.target.value
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate;
        const filteredMeddra = this.props.meddra.filter(el => el.name === this.state.meddra.current.value);
        const meddra = filteredMeddra && filteredMeddra[0] && !isNaN(parseInt(filteredMeddra[0].id)) ? parseInt(filteredMeddra[0].id) : undefined;
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                dateStartDate: date.toISOString(),
                endDate: !this.state.noEndDate ? this.state.endDate.toISOString() : undefined,
                type: this.state.ceType !== 'unselected' && !isNaN(parseInt(this.state.ceType)) ? parseInt(this.state.ceType) : undefined,
                meddra: meddra
            }
        };
    }

    _handleSubmitClick(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (this.state.ceType === 'unselected') {
            this.setState({
                error: 'Please indicate the even type'
            });
            return;
        }
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            this.props.createCE(requestBody);
        });
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Creating a New Event</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <div className={style.panel}>
                        <label htmlFor=''>Date of occurence:</label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br /><br />
                        <label htmlFor='noEndDate'>The event is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                        {this.state.noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.endDate ? this.state.endDate : moment()} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                        <label htmlFor='event'>What type of event is it?</label><br />
                        <select name='event' value={this.state.ceType} onChange={this._handleTypeChange} autoComplete='off'>
                            <option value='unselected'></option>
                            {this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select> <br /><br />
                        <label htmlFor='meddra'>MedDRA:</label><br />
                        <SuggestionInput reference={this.state.meddra} /><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        <button onClick={this._handleSubmitClick}>Submit</button>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}