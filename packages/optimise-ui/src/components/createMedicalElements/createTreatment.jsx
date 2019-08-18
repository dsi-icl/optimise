import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createTreatmentAPICall } from '../../redux/actions/treatments';
import style from './medicalEvent.module.css';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    visits: state.patientProfile.data.visits,
    interruptionReasons: state.availableFields.interruptionReasons,
    types: state.availableFields.drugs
}), dispatch => ({
    createTreatment: body => dispatch(createTreatmentAPICall(body))
}))
export class CreateTreatment extends Component {
    constructor() {
        super();
        this.state = {
            drugType: 'unselected',
            startDate: moment(),
            terminatedDate: moment(),
            drugModule: '',
            dose: '',
            unit: 'unselected',
            form: 'unselected',
            times: 'unselected',
            intervalUnit: 'unselected',
            noEndDate: true,
        };
        this.reasonRef = React.createRef();
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleTerminatedDateChange = this._handleTerminatedDateChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
    }

    _handleToggleNoEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked,
            error: false
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: false
        });
    }

    _handleTerminatedDateChange(date) {
        this.setState({
            terminatedDate: date,
            error: false
        });
    }

    _formatRequestBody() {
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                drugId: Number.parseInt(this.state.drugType),
                startDate: this.state.startDate.toISOString(),
                terminatedDate: this.state.terminatedDate && !this.state.noEndDate ? this.state.terminatedDate.toISOString() : undefined,
                dose: this.state.dose !== '' ? Number.parseInt(this.state.dose) : undefined,
                unit: this.state.unit !== '' ? this.state.unit : undefined,
                form: this.state.form !== '' ? this.state.form : undefined,
                times: isNaN(parseInt(this.state.times)) || this.state.intervalUnit === '' ? undefined : parseInt(this.state.times),
                intervalUnit: this.state.intervalUnit === '' || isNaN(parseInt(this.state.times)) ? undefined : this.state.intervalUnit,
            }
        };
    }

    _handleTypeChange(ev) {
        this.setState({
            drugType: parseInt(ev.target.value, 10),
            drugModule: ev.target.selectedOptions[0].attributes['data-drugmodule'].nodeValue,
            error: false
        });
    }

    _handleSubmitClick(e) {
        e.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the start date of the treatment'
            });
        }
        if (!this.state.noEndDate && (!this.state.terminatedDate || !this.state.terminatedDate.isValid())) {
            return this.setState({
                error: 'Please indicate the termination date of the treatment'
            });
        }
        if (this.state.drugType === 'unselected') {
            return this.setState({
                error: 'Please indicate the treatment'
            });
        }

        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            this.props.createTreatment(requestBody);
        });
    }

    _handleInputChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }


    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Creating a new Treatment</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        <label htmlFor='drug'>Treatment:</label><br />
                        <select name='drug' value={this.state.drugType} onChange={this._handleTypeChange} autoComplete='off'>
                            <option value='unselected'></option>
                            {this.props.types.filter(d => d.deleted === '-').sort((a, b) => a.name.localeCompare(b.name)).map(type => <option key={type.id} data-drugmodule={type.module} value={type.id}>{type.name}</option>)}
                        </select><br /><br />
                        {this.state.drugType !== 'unselected' ? <span><i>{`You have selected a treatment of type '${this.state.drugModule}'`}<br /><br /></i></span> : null}

                        <label htmlFor='startDate'>Start date: </label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br /><br />
                        <label htmlFor='dose'>Dose:</label><br /> <input value={this.state.dose} onChange={this._handleInputChange} name='dose' type='text' autoComplete='off' /><br /><br />
                        <label htmlFor='unit'>Unit:</label><br />
                        <select name='unit' value={this.state.unit} onChange={this._handleInputChange} autoComplete='off'>
                            <option value='unselected'></option>
                            <option value='mg'>mg</option>
                            <option value='cc'>cc</option>
                        </select><br /><br />
                        <label htmlFor='form'>Form:</label><br />
                        <select name='form' value={this.state.form} onChange={this._handleInputChange} autoComplete='off'>
                            <option value='unselected'></option>
                            <option value='OR'>Oral</option>
                            <option value='IV'>Intravenous</option>
                            <option value='IM'>Intramuscular</option>
                            <option value='SC'>Subcutaneous</option>
                        </select><br /><br />
                        <label>Frequency (fill both or leave both blank): </label>
                        <select name='times' value={this.state.times} onChange={this._handleInputChange} autoComplete='off'>
                            <option value='unselected'></option>
                            <option value='1'>once</option>
                            <option value='2'>twice</option>
                            <option value='3'>three times</option>
                            <option value='4'>four times</option>
                        </select><br /><br />
                        <select name='intervalUnit' value={this.state.intervalUnit} onChange={this._handleInputChange} autoComplete='off'>
                            <option value='unselected'></option>
                            <option value='day'>per day</option>
                            <option value='week'>per week</option>
                            <option value='month'>per month</option>
                            <option value='year'>per year</option>
                        </select><br /><br />
                        <label htmlFor='noEndDate'>The treatment is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={this.state.noEndDate} /><br />
                        {this.state.noEndDate ? null : (<><label htmlFor='terminatedDate'>End date: </label><PickDate startDate={this.state.terminatedDate ? this.state.terminatedDate : moment()} handleChange={this._handleTerminatedDateChange} /><br /><br /></>)}
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        <button onClick={this._handleSubmitClick} >Submit</button>
                    </form>
                </>
            );
        } else {
            return null;
        }
    }
}