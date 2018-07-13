import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import cssButtons from '../../../css/buttons.module.css';
import { PickDate } from '../createMedicalElements/datepicker.jsx';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';
import moment from 'moment';
import { formatRow } from './patientChart.jsx';
import store from '../../redux/store.js';
import { createImmunisationAPICall, createPregnancyAPICall } from '../../redux/actions/demographicData.js';
import { SuggestionInput } from '../meDRA/meDRApicker.jsx';
import { SelectField } from '../createPatient/createPatientPage.jsx';
import cssSections from '../../../css/sectioning.module.css';
import { erasePatientAPICall, erasePatientReset } from '../../redux/actions/erasePatient.js';
import { updateConsentAPICall } from '../../redux/actions/consent.js';

@connect(state => ({ fetching: state.patientProfile.fetching, erasePatient: state.erasePatient }))
export class Section extends Component {
    componentWillUnmount() {
        store.dispatch(erasePatientReset());
    }

    render() {
        const { fetching, erasePatient } = this.props;
        if (fetching) {
            return <span></span>;
        } else {
            if (erasePatient.requesting) {
                return <div>Trying to delete the patient..</div>;
            } else {
                if (erasePatient.error) {
                    return <div> Cannot delete this patient </div>;
                } else {
                    if (erasePatient.success) {
                        return <Redirect to='/searchPatientById'/>;
                    } else {
                        return (
                            <div style={{ position: 'relative' }}>
                                <DemographicSection />
                                <PrimaryDiagnosis />
                                <ImmunisationSection />
                                <Pregnancy />
                                <DeletePatient match={this.props.match}/>
                            </div>
                        );
                    }
                }
            }
        }
    }
}

@connect(state => ({ demographicData: state.patientProfile.data.demographicData ? state.patientProfile.data.demographicData : false, fields: state.availableFields.demoFields[0] }))
class DemographicSection extends Component {
    render() {
        const { demographicData, fields } = this.props;
        if (demographicData) {
            let { DOB, alcoholUsage, countryOfOrigin, dominantHand, ethnicity, gender, smokingHistory } = demographicData;
            alcoholUsage = fields['alcohol_usage'].filter(el => el.id === alcoholUsage)[0].value;
            countryOfOrigin = fields['countries'].filter(el => el.id === countryOfOrigin)[0].value;
            dominantHand = fields['dominant_hands'].filter(el => el.id === dominantHand)[0].value;
            ethnicity = fields['ethnicities'].filter(el => el.id === ethnicity)[0].value;
            gender = fields['genders'].filter(el => el.id === gender)[0].value;
            smokingHistory = fields['smoking_history'].filter(el => el.id === smokingHistory)[0].value;

            return (
                <PatientProfileSectionScaffold sectionName='Profile'>
                    <span><b>Date of birth:</b> {new Date(parseInt(DOB, 10)).toDateString()}</span><br />
                    <span><b>Gender:</b> {gender} </span><br />
                    <span><b>Dominant hand:</b> {dominantHand} </span><br />
                    <span><b>Ethnicity:</b> {ethnicity} </span><br />
                    <span><b>Country of origin:</b> {countryOfOrigin} </span><br />
                    <span><b>Alcohol usage:</b> {alcoholUsage} </span><br />
                    <span><b>Smoking history:</b> {smokingHistory} </span><br />
                </PatientProfileSectionScaffold>
            );
        } else {
            return <div>Please add demographic data via the API.</div>;
        }
    }
}

@connect(state => ({ data: state.patientProfile.data }))
class ImmunisationSection extends Component {
    constructor() {
        super();
        this.state = { addMore: false, newDate: moment(), newName: null };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: null });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value });
    }


    _handleDateChange(date) {
        this.setState({
            newDate: date
        });
    }

    _handleSubmit() {
        const data = this.props.data;
        const body = { patientId: data.patientId, data: { patient: data.id, vaccineName: this.state.newName, immunisationDate: this.state.newDate._d.toDateString() } };
        store.dispatch(createImmunisationAPICall(body));
    }

    render() {
        const { data } = this.props;
        const inputStyle = { width: '100%', margin: 0 };
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                <table style={{ width: '100%' }}>
                    {this.state.addMore || data.immunisations.length !== 0 ? <thead>
                        <tr><th>Vaccine name</th><th>Date</th></tr>
                    </thead> : null}
                    <tbody>
                        {data.immunisations.map(el => formatRow([el.vaccineName, new Date(parseInt(el.immunisationDate, 10)).toDateString()]))}
                        {!this.state.addMore ? null : <tr>
                            <td><input style={inputStyle} value={this.state.newName} onChange={this._handleInput} placeholder='vaccine name' name='vaccineName' type='text' /></td>
                            <td><PickDate startDate={this.state.newDate} handleChange={this._handleDateChange} /></td>
                        </tr>}
                    </tbody>
                </table>
                {!this.state.addMore ? <div className={cssButtons.createPatientButton} onClick={this._handleClickingAdd}>Add immunisation</div> :
                    <div>
                        <div className={cssButtons.createPatientButton} onClick={this._handleSubmit}>Submit</div>
                        <div onClick={this._handleClickingAdd} className={cssButtons.createPatientButton}>Cancel</div>
                    </div>}
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data, fields: state.availableFields.diagnoses }))
class PrimaryDiagnosis extends Component {
    render() {
        if (this.props.data.diagnosis.length === 0){
            return null;
        }
        const diagnosis = this.props.fields.filter(el => el.id === this.props.data.diagnosis[0].diagnosis);
        if (diagnosis.length === 0){
            return null;
        }
        return (
            <div>
                <PatientProfileSectionScaffold sectionName='Primary Diagnosis'>
                    <b>Primary Diagnosis: </b>{ diagnosis[0].value } <br/>
                    <b>Date of diagnosis: </b>{ new Date(parseInt(this.props.data.diagnosis[0].diagnosisDate, 10)).toDateString()}
                </PatientProfileSectionScaffold>
            </div>
        );
    }
}


@connect(state => ({ data: state.patientProfile.data, allMeddra: state.availableFields.allMeddra, outcomes: state.availableFields.pregnancyOutcomes, meddra: state.meddra.result }))
class Pregnancy extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            addMore: false,
            newStartDate: moment(),
            newOutcomeDate: moment(),
            newMeddra: React.createRef(),
            newOutcome: 1
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleOutcomeDateChange = this._handleOutcomeDateChange.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleMeddra = this._handleMeddra.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, error: false });
    }

    _handleInput(ev) {
        const newState = { error: false };
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleOutcomeDateChange(date) {
        this.setState({
            newOutcomeDate: date,
            error: false
        });
    }

    _handleStartDateChange(date) {
        this.setState({
            newStartDate: date,
            error: false
        });
    }

    _handleMeddra(){
        this.setState({
            error: false
        });
    }

    _handleSubmit() {
        const data = this.props.data;
        const meddraField = this.props.meddra.filter(el => el.name === this.state.newMeddra.current.value);
        if (meddraField.length === 0) {
            this.setState({ error: true });
            return;
        }
        const body = { 
            patientId: data.patientId,
            data: {
                patient: data.id,
                outcome: this.state.newOutcome,
                startDate: this.state.newStartDate._d.toDateString(),
                meddra: meddraField[0].id,
                outcomeDate: this.state.newOutcomeDate._d.toDateString()
            }
        };
        console.log(body);
        store.dispatch(createPregnancyAPICall(body));
    }

    render() {
        const { data } = this.props;
        if (data.demographicData && data.demographicData.gender !== 1 && data.pregnancy) {
            const inputStyle = { width: '100%', margin: 0 };
            return (
                <div>
                    <PatientProfileSectionScaffold sectionName='Pregnancies'>
                        {data.pregnancy.map(el =>
                            <div className={cssSections.profileSubDataSection}>
                                <b>Start date: </b> {new Date(parseInt(el.startDate, 10)).toDateString()} <br/>
                                <b>Outcome date: </b> {el.outcomeDate ? new Date(parseInt(el.outcomeDate, 10)).toDateString() : 'NA'} <br/>
                                <b>MedDRA: </b> {this.props.allMeddra[0][el.meddra]} <br/>
                                <b>Outcome: </b> {el.outcome} <br/>
                            </div>)}
                        {!this.state.addMore ? null : 
                            <div className={cssSections.profileSubDataSection}>
                                <b>Start date: </b><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br/>
                                <b>Outcome date: </b><PickDate startDate={this.state.newOutcomeDate} handleChange={this._handleOutcomeDateChange} /><br/>
                                <b>MedDRA: </b><SuggestionInput extraHandler={this._handleMeddra} reference={this.state.newMeddra}/><br/>
                                <b>Outcome: </b><br/><SelectField value={this.state.newOutcome} options={this.props.outcomes} handler={this._handleInput} name='newOutcome'/>
                            </div>
                        }
                        {!this.state.addMore ? <div className={cssButtons.createPatientButton} onClick={this._handleClickingAdd}>Record pregnancy</div> :
                            <div>
                                <div className={cssButtons.createPatientButton} onClick={this._handleSubmit}>Submit</div>
                                <div onClick={this._handleClickingAdd} className={cssButtons.createPatientButton}>Cancel</div>
                            </div>}
                        {this.state.error ? <div>Your MedDRA field is not permitted</div> : null}
                    </PatientProfileSectionScaffold>
                </div>);
        } else {
            return null;
        }
    }
}


/**
 * @prop {Object} this.props.match
 */
@connect(state => ({data: state.patientProfile.data}))
class DeletePatient extends Component {
    constructor() {
        super();
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._handleClickWithdrawConsent = this._handleClickWithdrawConsent.bind(this);
    }

    _handleClickDelete(){
        const body = { alias_id: this.props.match.params.patientId };
        store.dispatch(erasePatientAPICall(body));
    }

    _handleClickWithdrawConsent(){
        const { consent, id } = this.props.data;
        const body = { patientId: this.props.match.params.patientId, data: { consent: !consent, patient: id } };
        store.dispatch(updateConsentAPICall(body));
    }


    render() {
        const { consent } = this.props.data;
        return (
            <div>
                <PatientProfileSectionScaffold sectionName='DELETE PATIENT AND CONSENT'>
                    <div onClick={this._handleClickDelete} className={cssButtons.createPatientButton}>Delete this patient</div>
                    <div onClick={this._handleClickWithdrawConsent} className={cssButtons.createPatientButton}>{consent ? 'This patient withdraws consent' : 'This patient gives consent'}</div>
                </PatientProfileSectionScaffold>
            </div>
        );
    }
}