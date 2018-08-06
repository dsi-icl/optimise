import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createCEAPICall } from '../../redux/actions/clinicalEvents';
import { SuggestionInput } from '../meDRA/meDRApicker';
import style from './medicalEvent.module.css';
import { addError } from '../../redux/actions/error';
import store from '../../redux/store';

//not yet finished the dispatch
@connect(state => ({ patientId: state.patientProfile.data.id, visits: state.patientProfile.data.visits, types: state.availableFields.clinicalEventTypes, meddra: state.meddra.result }), dispatch => ({ createCE: body => dispatch(createCEAPICall(body)) }))
export class CreateCE extends Component {
    constructor() {
        super();
        this.state = {
            noEndDate: true,
            endDate: moment(),
            startDate: moment(),
            ceType: '1',
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

    componentDidMount() {
        this.setState({
            ceType: this.props.types[0].id
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            ceType: parseInt(ev.target.value, 10)
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate;
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                dateStartDate: date.toISOString(),
                endDate: !this.state.noEndDate ? this.state.endDate.toISOString() : undefined,
                type: Number.parseInt(this.state.ceType),
                meddra: Number.parseInt(this.props.meddra.filter(el => el.name === this.state.meddra.current.value)[0].id)
            }
        };
    }

    _handleSubmitClick() {
        const meddra = this.props.meddra.filter(el => el.name === this.state.meddra.current.value);
        if (meddra.length === 0) {
            store.dispatch(addError({ error: 'The MedDRA code entered doesn\'t seem to be valid!' }));
            return;
        }
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        this.props.createCE(requestBody);
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
                        <select name='event' value={this.state.testType} onChange={this._handleTypeChange} autoComplete='off'>
                            {this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select> <br /><br />
                        <label htmlFor='meddra'>MedDRA:</label><br />
                        <SuggestionInput reference={this.state.meddra} /><br /><br />
                        <button onClick={this._handleSubmitClick}>Submit</button>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}