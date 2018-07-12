import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { PickDate } from './datepicker.jsx';
import { BackButton } from '../medicalData/dataPage.jsx';
import cssTexts from '../../../css/inlinetexts.module.css';
import cssButtons from '../../../css/buttons.module.css';
import { createTreatmentAPICall } from '../../redux/actions/treatments.js';

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
                timesPerDay: this.state.form,
                durationInWeeks: this.state.durationInWeeks
            }
        };
    }

    _handleTypeChange(ev) {
        this.setState({
            drugType: parseInt(ev.target.value, 10),
            drugModule: ev.target.selectedOptions[0].attributes.drugModule.nodeValue
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
            const visitDate = new Date(parseInt(this.props.visits.filter(visit => visit.visitId === params.visitId)[0].visitDate, 10)).toDateString();
            return (<div>
                <BackButton to={`/patientProfile/${params.patientId}`} />
                <h2>CREATE A NEW TREATMENT</h2>
                <span class={cssTexts.centeredBlock}><b>Visit:</b> {visitDate}</span>
                <br /><br />
                <span class={cssTexts.centeredBlock}>What drug is it?
                    <select value={this.state.drugType} onChange={this._handleTypeChange}>
                        {this.props.types.map(type => <option key={type.id} drugModule={type.module} value={type.id}>{type.name}</option>)}
                    </select>
                </span><br />
                {this.state.drugType !== '' ? <div>{`You have selected a drug of type '${this.state.drugModule}'`}<br /><br /></div> : null}
                Dose: <input value={this.state.dose} onChange={this._handleInputChange} name='dose' type='text' />
                <br /><br />
                Unit: <input value={this.state.unit} onChange={this._handleInputChange} name='unit' type='text' />
                <br /><br />
                Form: <input value={this.state.form} onChange={this._handleInputChange} name='form' type='text' />
                <br /><br />
                Times per day: <input onChange={this._handleInputChange} value={this.state.timesPerDay} name='timesPerDay' type='text' />
                <br /><br />
                Duration in weeks: <input value={this.state.durationInWeeks} onChange={this._handleInputChange} name='durationInWeeks' type='text' />
                <br />
                <div onClick={this._handleSubmitClick} className={cssButtons.createPatientButton} style={{ width: '30%' }}>Submit</div>
            </div>);
        } else {
            return null;
        }
    }
}