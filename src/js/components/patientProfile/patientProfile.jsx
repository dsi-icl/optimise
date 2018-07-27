import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { PatientProfileSectionScaffold, DeleteButton, EditButton } from './sharedComponents';
import { formatRow } from './patientChart';
import store from '../../redux/store';
import { createImmunisationAPICall, createPregnancyAPICall, deleteImmunisationAPICall } from '../../redux/actions/demographicData';
import { SuggestionInput } from '../meDRA/meDRApicker';
import { SelectField } from '../createPatient';
import { erasePatientAPICall, erasePatientReset } from '../../redux/actions/erasePatient';
import { updateConsentAPICall } from '../../redux/actions/consent';
import { addAlert } from '../../redux/actions/alert';
import style from './patientProfile.module.css';

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
            if (erasePatient.success) {
                return <Redirect to='/searchPatient/from/deletionSuccessful' />;
            } else {
                return (
                    <>
                        <div className={style.ariane}>
                            <h2>Overview</h2>
                        </div>
                        <div className={style.panel}>
                            <DemographicSection patientId={this.props.match.params.patientId} />
                            <PrimaryDiagnosis patientId={this.props.match.params.patientId} />
                            <ImmunisationSection patientId={this.props.match.params.patientId} />
                            <Pregnancy />
                            <DeletePatient match={this.props.match} />
                        </div>
                    </>
                );
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
                <PatientProfileSectionScaffold sectionName='Profile' actions={
                    <EditButton to={`/patientProfile/${this.props.patientId}/edit/demographic/data`} />
                }>
                    <label>Date of birth:</label> {new Date(parseInt(DOB, 10)).toDateString()}<br />
                    <label>Gender:</label> {gender}<br />
                    <label>Dominant hand:</label> {dominantHand} <br />
                    <label>Ethnicity:</label> {ethnicity} <br />
                    <label>Country of origin:</label> {countryOfOrigin} <br />
                    <label>Alcohol usage:</label> {alcoholUsage} <br />
                    <label>Smoking history:</label> {smokingHistory}
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
        this.state = { addMore: false, newDate: moment(), newName: '' };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: '' });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value });
    }

    _handleClickDelete(el) {
        store.dispatch(addAlert({ alert: 'about deleting this immunisation record?', handler: this._deleteFunction(el.id) }));
    }

    _deleteFunction(id) {
        const that = this;
        return function () {
            const body = {
                patientId: that.props.patientId,
                data: {
                    id: id  //PLACEHOLDERBODY
                }
            };

            store.dispatch(deleteImmunisationAPICall(body));
        }
    }


    _handleDateChange(date) {
        this.setState({
            newDate: date
        });
    }

    _handleSubmit() {
        const data = this.props.data;
        const body = {
            patientId: data.patientId,
            data: {
                patient: data.id,
                vaccineName: this.state.newName,
                immunisationDate: this.state.newDate._d.toDateString()
            }
        };
        store.dispatch(createImmunisationAPICall(body));
    }

    render() {
        const { data } = this.props;
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations' active={this.state.addMore}>
                <table cellSpacing={'1em'}>
                    {this.state.addMore || data.immunisations.length !== 0 ? <thead>
                        <tr><th>Vaccine name</th><th>Date</th></tr>
                    </thead> : null}
                    <tbody>
                        {data.immunisations.map(el => (
                            <tr key={el.vaccineName} className={style.immunisationItem}>
                                {formatRow([
                                    el.vaccineName,
                                    new Date(parseInt(el.immunisationDate, 10)).toDateString(),
                                    <DeleteButton clickhandler={() => this._handleClickDelete(el)} />
                                ])}
                            </tr>
                        ))}
                        {!this.state.addMore ? null : <tr className={style.immunisationNewItem}>
                            <td><input value={this.state.newName} onChange={this._handleInput} placeholder='vaccine name' name='vaccineName' type='text' /></td>
                            <td colSpan='2'><PickDate startDate={this.state.newDate} handleChange={this._handleDateChange} /></td>
                        </tr>}
                    </tbody>
                </table>
                {!this.state.addMore ?
                    <>
                        <br />
                        <button onClick={this._handleClickingAdd}>Add immunisation</button>
                    </> :
                    <>
                        <br /><br />
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button>
                    </>}
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data, fields: state.availableFields.diagnoses }))
class PrimaryDiagnosis extends Component {
    render() {
        if (this.props.data.diagnosis.length === 0) {
            return null;
        }
        const diagnosis = this.props.fields.filter(el => el.id === this.props.data.diagnosis[0].diagnosis);
        if (diagnosis.length === 0) {
            return null;
        }
        return (
            <PatientProfileSectionScaffold sectionName='Primary Diagnosis' actions={
                <EditButton to={`/patientProfile/${this.props.patientId}/edit/diagnosis/data`} />
            }>
                <label>Primary Diagnosis: </label> {diagnosis[0].value} <br />
                <label>Date of diagnosis: </label> {new Date(parseInt(this.props.data.diagnosis[0].diagnosisDate, 10)).toDateString()}
            </PatientProfileSectionScaffold>
        );
    }
}


@connect(state => ({ outcomeHash: state.availableFields.pregnancyOutcomes_Hash[0], data: state.patientProfile.data, allMeddra: state.availableFields.allMeddra, outcomes: state.availableFields.pregnancyOutcomes, meddra: state.meddra.result }))
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

    _handleMeddra() {
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
        const { newOutcome, newStartDate, newOutcomeDate } = this.state;
        const body = {
            patientId: data.patientId,
            data: {
                patient: data.id,
                outcome: parseInt(newOutcome, 10),
                startDate: newStartDate ? newStartDate._d.toDateString() : null,
                meddra: meddraField[0].id,
                outcomeDate: newOutcomeDate ? newOutcomeDate._d.toDateString() : null
            }
        };
        store.dispatch(createPregnancyAPICall(body));
    }

    render() {
        const { data, outcomeHash } = this.props;
        if (data.demographicData && data.demographicData.gender !== 1 && data.pregnancy) {
            return (
                <div className={this.state.addMore ? style.pregnancyPanelActive : style.pregnancyPanel}>
                    <PatientProfileSectionScaffold sectionName='Pregnancies' active={this.state.addMore}>
                        {data.pregnancy.map((el, ind) =>
                            <div key={`${el.meddra}${el.outcomeDate}`} className={ind === data.pregnancy.length - 1 ? style.pregnancyLast : style.pregnancy}>
                                <label>Start date: </label> {new Date(parseInt(el.startDate, 10)).toDateString()} <br />
                                <label>Outcome date: </label> {el.outcomeDate ? new Date(parseInt(el.outcomeDate, 10)).toDateString() : 'NA'} <br />
                                <label>MedDRA: </label> {this.props.allMeddra[0][el.meddra]} <br />
                                <label>Outcome: </label> {outcomeHash[el.outcome]} <br />
                            </div>)}
                        {!this.state.addMore ? null :
                            <div className={style.newPregnancy}>
                                <label>Start date: </label><br /><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br />
                                <label>Outcome date: </label><br /><PickDate startDate={this.state.newOutcomeDate} handleChange={this._handleOutcomeDateChange} /><br />
                                <label>Outcome: </label><br /><SelectField value={this.state.newOutcome} options={this.props.outcomes} handler={this._handleInput} name='newOutcome' /><br /><br />
                                <label>MedDRA: </label><br /><SuggestionInput extraHandler={this._handleMeddra} reference={this.state.newMeddra} />
                            </div>
                        }
                        {!this.state.addMore ? <button onClick={this._handleClickingAdd}>Record pregnancy</button> :
                            <>
                                <br />
                                <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                <button onClick={this._handleClickingAdd}>Cancel</button>
                            </>}
                        {this.state.error ? <><br /><div className={style.error}>Your MedDRA field is not permitted</div></> : null}
                    </PatientProfileSectionScaffold>
                </div>
            );
        } else {
            return null;
        }
    }
}


/**
 * @prop {Object} this.props.match
 */
@connect(state => ({ data: state.patientProfile.data }))
class DeletePatient extends Component {
    constructor() {
        super();
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._handleClickWithdrawConsent = this._handleClickWithdrawConsent.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    _handleClickDelete() {
        store.dispatch(addAlert({ alert: `about deleting patient ${this.props.data.patientId}?`, handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const body = {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.data.id
            }
        };
        store.dispatch(erasePatientAPICall(body));
    }

    _handleClickWithdrawConsent() {
        const { consent, id } = this.props.data;
        const body = {
            patientId: this.props.match.params.patientId,
            data: {
                consent: !consent,
                id: id
            }
        };
        store.dispatch(updateConsentAPICall(body));
    }


    render() {
        const { consent } = this.props.data;
        return (
            <>
                <PatientProfileSectionScaffold sectionName='Consent'>
                    <button onClick={this._handleClickWithdrawConsent} >{consent ? 'This patient withdraws consent' : 'This patient gives consent'}</button>
                </PatientProfileSectionScaffold>
                <PatientProfileSectionScaffold sectionName='Delete'>
                    <button onClick={this._handleClickDelete} >Delete this patient</button><br /><br />
                </PatientProfileSectionScaffold>
            </>
        );
    }
}