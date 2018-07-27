import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/dataPage';
import { createTreatmentAPICall } from '../../redux/actions/treatments';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
/* patch the drug mapping from state and to UI when the backend API is finished */
@connect(state => ({ visits: state.patientProfile.data.visits, types: state.availableFields.drugs }), dispatch => ({ createTreatment: body => dispatch(createTreatmentAPICall(body)) }))
export class CreateTreatment extends Component {
    constructor() {
        super();
        this.state = {
            drugType: '',
            startDate: moment(),
            drugModule: '',
            dose: '',
            unit: '',
            form: '',
            times: '',
            intervalUnit: ''
        };
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            drugType: this.props.types[0].id,
            drugModule: this.props.types[0].module
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }


    _formatRequestBody() {
        return {
            patientId: this.props.match.params.patientId,
            data: {
                visitId: Number.parseInt(this.props.match.params.visitId),
                drugId: Number.parseInt(this.state.drugType),
                startDate: this.state.startDate._d.toDateString(),
                dose: Number.parseInt(this.state.dose),
                unit: this.state.unit,
                form: this.state.form,
                times: this.state.times === '' || this.state.times === undefined ? null : Number.parseInt(this.state.times),
                intervalUnit: this.state.intervalUnit === '' || this.state.intervalUnit === undefined ? null : this.state.intervalUnit
            }
        };
    }

    _handleTypeChange(ev) {
        this.setState({
            drugType: parseInt(ev.target.value, 10),
            drugModule: ev.target.selectedOptions[0].attributes['data-drugmodule'].nodeValue
        });
    }

    _handleSubmitClick(e) {
        e.preventDefault();
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        this.props.createTreatment(requestBody);
    }

    _handleInputChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            const visitDate = new Date(parseInt(this.props.visits.filter(visit => visit.id === parseInt(params.visitId, 10))[0].visitDate, 10)).toDateString();
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Creating a new Treatment</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        <span><i>This is for the visit of the {visitDate}</i></span><br /><br />
                        <label htmlFor='drug'>What drug is it?</label><br />
                        <select name='drug' value={this.state.drugType} onChange={this._handleTypeChange} autoComplete='off'>
                            {this.props.types.map(type => <option key={type.id} data-drugmodule={type.module} value={type.id}>{type.name}</option>)}
                        </select><br /><br />
                        {this.state.drugType !== '' ? <span><i>{`You have selected a drug of type '${this.state.drugModule}'`}<br /><br /></i></span> : null}

                        <label htmlFor='startDate'>Start date: </label><br/><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br/><br/>
                        <label htmlFor='dose'>Dose:</label><br /> <input value={this.state.dose} onChange={this._handleInputChange} name='dose' type='text' autoComplete='off' /><br /><br />
                        <label htmlFor='unit'>Unit:</label><br />
                        <select name='unit' value={this.state.unit} onChange={this._handleInputChange} autoComplete='off'>
                            <option value=''></option>
                            <option value='mg'>mg</option>
                            <option value='cc'>cc</option>
                        </select><br /><br />
                        <label htmlFor='form'>Form:</label><br />
                        <select name='form' value={this.state.form} onChange={this._handleInputChange} autoComplete='off'>
                            <option value=''></option>
                            <option value='OR'>Oral</option>
                            <option value='IV'>Intravenous</option>
                            <option value='IM'>Intramuscular</option>
                            <option value='SC'>Subcutaneous</option>
                        </select><br /><br />
                        <h4>Frequency (fill both or leave both blank): </h4>
                        <label htmlFor='times'>Number of times:</label><br /> <input onChange={this._handleInputChange} value={this.state.times} name='times' type='text' autoComplete='off' /><br /><br />
                        <label htmlFor='intervalUnit'>per </label>
                        <select name='intervalUnit' value={this.state.intervalUnit} onChange={this._handleInputChange} autoComplete='off'>
                            <option value=''></option>
                            <option value='hour'>hour</option>
                            <option value='day'>day</option>
                            <option value='week'>week</option>
                            <option value='month'>month</option>
                            <option value='year'>year</option>
                        </select><br /><br />
                        <button onClick={this._handleSubmitClick} >Submit</button>
                    </form>
                </>
            );
        } else {
            return null;
        }
    }
}