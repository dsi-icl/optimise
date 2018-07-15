import React, { Component } from 'react';
import { connect } from 'react-redux';
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
            drugModule: '',
            dose: '',
            unit: '',
            form: '',
            timesPerDay: '',
            durationInWeeks: ''
        };
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
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

    _formatRequestBody() {
        return {
            patientId: this.props.match.params.patientId,
            data: {
                visitId: this.props.match.params.visitId,
                drugId: this.state.drugType,
                dose: this.state.dose,
                unit: this.state.unit,
                form: this.state.form,
                timesPerDay: this.state.timesPerDay,
                durationInWeeks: this.state.durationInWeeks
            }
        };
    }

    _handleTypeChange(ev) {
        this.setState({
            drugType: parseInt(ev.target.value, 10),
            drugModule: ev.target.selectedOptions[0].attributes['data-drugmodule'].nodeValue
        });
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
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
            const visitDate = new Date(parseInt(this.props.visits.filter(visit => visit.visitId === parseInt(params.visitId, 10))[0].visitDate, 10)).toDateString();
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Create a new Treatment</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        <span><i>This is for the visit of the {visitDate}</i></span><br /><br />
                        <label htmlFor='drug'>What drug is it?</label><br />
                        <select name='drug' value={this.state.drugType} onChange={this._handleTypeChange}>
                            {this.props.types.map(type => <option key={type.id} data-drugmodule={type.module} value={type.id}>{type.name}</option>)}
                        </select><br /><br />
                        {this.state.drugType !== '' ? <span><i>{`You have selected a drug of type '${this.state.drugModule}'`}<br /><br /></i></span> : null}
                        <label htmlFor='dose'>Dose:</label><br /> <input value={this.state.dose} onChange={this._handleInputChange} name='dose' type='text' /><br /><br />
                        <label htmlFor='unit'>Unit:</label><br /> <input value={this.state.unit} onChange={this._handleInputChange} name='unit' type='text' /><br /><br />
                        <label htmlFor='form'>Form:</label><br /> <input value={this.state.form} onChange={this._handleInputChange} name='form' type='text' /><br /><br />
                        <label htmlFor='timesPerDay'>Times per day:</label><br /> <input onChange={this._handleInputChange} value={this.state.timesPerDay} name='timesPerDay' type='text' /><br /><br />
                        <label htmlFor='durationInWeeks'>Duration in weeks:</label><br /> <input value={this.state.durationInWeeks} onChange={this._handleInputChange} name='durationInWeeks' type='text' /><br /><br />
                        <button onClick={this._handleSubmitClick} >Submit</button>
                    </form>
                </>
            );
        } else {
            return null;
        }
    }
}