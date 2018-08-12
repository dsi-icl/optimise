import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { PatientProfileSectionScaffold, DeleteButton, EditButton } from './sharedComponents';
import { formatRow } from './patientChart';
import store from '../../redux/store';
import { createImmunisationAPICall, createPregnancyAPICall, deleteImmunisationAPICall, deletePregnancyAPICall, editPregnancyAPICall } from '../../redux/actions/demographicData';
import { MeddraPicker } from '../meDRA/meddraPicker';
import { SelectField } from '../createPatient';
import { erasePatientAPICall, erasePatientReset } from '../../redux/actions/erasePatient';
import { updateConsentAPICall } from '../../redux/actions/consent';
import { addAlert } from '../../redux/actions/alert';
import style from './patientProfile.module.css';
import { addError } from '../../redux/actions/error';
import Icon from '../icon/icon';

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
                        <div className={`${style.panel} ${style.patientInfo}`}>
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
        store.dispatch(addAlert({ alert: 'Are you sure you want to delete this immunisation record?', handler: this._deleteFunction(el.id) }));
    }

    _deleteFunction(id) {
        const that = this;
        return () => {
            const body = {
                patientId: that.props.patientId,
                data: {
                    id: id
                }
            };

            store.dispatch(deleteImmunisationAPICall(body));
        };
    }


    _handleDateChange(date) {
        this.setState({
            newDate: date
        });
    }

    _handleSubmit(ev) {

        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (this.state.newName === undefined || this.state.newName === null || this.state.newName === '') {
            store.dispatch(addError({ error: 'Vaccine name cannot be empty!' }));
            return;
        }

        if (this.currenttlySumbitting === this.state.newName)
            return;

        const data = this.props.data;
        const body = {
            patientId: data.patientId,
            data: {
                patient: data.id,
                vaccineName: this.state.newName,
                immunisationDate: this.state.newDate.toISOString()
            }
        };
        this.setState({
            newName: this.state.newName,
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(createImmunisationAPICall(body));
            this.setState({
                newName: '',
                addMore: false
            });
        });
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
                        <button onClick={this._handleClickingAdd}>Add immunisation</button>
                    </> :
                    <>
                        <br /><br />
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button><br />
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
        const diagnosis =  this.props.data.diagnosis.sort((a, b) => parseInt(a.diagnosisDate) > parseInt(b.diagnosisDate))[0];
        if (!diagnosis) {
            return null;
        }

        const diagnosisName = this.props.fields.filter(el => el.id === diagnosis.diagnosis)[0];
        if (!diagnosisName) {
            return null;
        }

        return (
            <PatientProfileSectionScaffold sectionName='Last Primary Diagnosis' actions={
                <EditButton to={`/patientProfile/${this.props.patientId}/edit/diagnosis/data`} />
            }>
                <>
                    <label>Date of diagnosis: </label> {new Date(parseInt(diagnosis.diagnosisDate, 10)).toDateString()} < br />
                    <label>Diagnosis: </label> {diagnosisName.value}
                </>
            </PatientProfileSectionScaffold>
        );
    }
}


@connect(state => ({ outcomeHash: state.availableFields.pregnancyOutcomes_Hash[0], data: state.patientProfile.data, meddra_Hash: state.availableFields.meddra_Hash[0], outcomes: state.availableFields.pregnancyOutcomes }))
class Pregnancy extends Component {
    constructor() {
        super();
        this.state = {
            noEndDate: true,
            error: false,
            addMore: false,
            newStartDate: moment(),
            newOutcomeDate: moment(),
            newMeddra: undefined,
            newOutcome: 0
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleOutcomeDateChange = this._handleOutcomeDateChange.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked
        });
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


    _handleMeddraChange(value) {
        this.setState({
            newMeddra: value,
            error: false
        });
    }

    _handleSubmit(ev) {

        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const data = this.props.data;
        const { noEndDate, newOutcome, newStartDate, newOutcomeDate, newMeddra } = this.state;

        if (!noEndDate) {

            if (newOutcome === 0 || newOutcome === '0') {
                this.setState({ error: 'outcome' });
                return;
            }

        }

        const body = {
            patientId: data.patientId,
            data: {
                patient: data.id,
                startDate: newStartDate ? newStartDate.toISOString() : undefined,
                outcome: !noEndDate && newOutcome ? parseInt(newOutcome, 10) : undefined,
                meddra: !noEndDate && newMeddra !== undefined ? parseInt(newMeddra) : undefined,
                outcomeDate: !noEndDate && newOutcomeDate ? newOutcomeDate.toISOString() : undefined
            }
        };


        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(createPregnancyAPICall(body));
            this.setState({
                addMore: false
            });
        });
    }

    render() {
        const { data, outcomeHash, meddra_Hash, outcomes } = this.props;
        if (data.demographicData && data.demographicData.gender !== 1 && data.pregnancy) {
            return (
                <div className={this.state.addMore ? style.pregnancyPanelActive : style.pregnancyPanel}>
                    <PatientProfileSectionScaffold sectionName='Pregnancies' active={this.state.addMore}>
                        {!this.state.addMore ? (
                            <>
                                {data.pregnancy.map((el) =>
                                    <OnePregnancy
                                        key={Math.random()}
                                        data={el}
                                        patientId={data.patientId}
                                        outcomeHash={outcomeHash}
                                        meddra_Hash={meddra_Hash}
                                        outcomes={outcomes}
                                    />)
                                }
                            </>
                        ) :
                            <div className={style.newPregnancy}>
                                <label>Start date: </label><br /><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br />
                                <label htmlFor='noEndDate'>The pregnancy is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                                {this.state.noEndDate ? null : (
                                    <>
                                        <label>Outcome date: </label><br /><PickDate startDate={this.state.newOutcomeDate} handleChange={this._handleOutcomeDateChange} /><br />
                                        <label>Outcome: </label><br /><SelectField value={this.state.newOutcome} options={outcomes} handler={this._handleInput} name='newOutcome' /><br /><br />
                                        <label>MedDRA: </label><br /><MeddraPicker onChange={this._handleMeddraChange} value={this.state.newMeddra} key={`${data.id}${new Date().getMilliseconds}`} />
                                    </>
                                )}
                            </div>
                        }
                        {!this.state.addMore ? <button onClick={this._handleClickingAdd}>Record pregnancy</button> :
                            <>
                                <br />
                                {this.state.error ? <><div className={style.error}>Please enter the {this.state.error}</div><br /></> : null}
                                <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                <button onClick={this._handleClickingAdd}>Cancel</button>
                            </>}
                    </PatientProfileSectionScaffold>
                </div>
            );
        } else {
            return null;
        }
    }
}


class OnePregnancy extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,

            noEndDate: data.outcomeDate ? false : true,

            startDate: moment(parseInt(data.startDate)),
            outcomeDate: data.outcomeDate ? moment(parseInt(data.outcomeDate)) : moment(),
            outcome: data.outcome,
            meddra: data.meddra ? String(data.meddra) : null,

            startDate_original: moment(parseInt(data.startDate)),
            outcomeDate_original: data.outcomeDate ? moment(parseInt(data.outcomeDate)) : null,
            outcome_original: data.outcome,
            meddra_original: data.meddra ? String(data.meddra) : null,
        };
    }

    _handleClickDelete = (el) => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this pregnancy record?', handler: this._deleteFunction(el.id) }));
    }

    _deleteFunction = (id) => {
        const that = this;
        return () => {
            const body = {
                patientId: that.props.patientId,
                data: {
                    id: id
                }
            };
            store.dispatch(deletePregnancyAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        const { data, patientId } = this.props;
        const { startDate, noEndDate, outcomeDate, outcome, meddra } = this.state;
        const body = {
            patientId: patientId,
            data: {
                id: parseInt(data.id, 10),
                startDate: startDate.toISOString(),
                outcomeDate: !noEndDate && outcomeDate ? outcomeDate.toISOString() : null,
                outcome: !noEndDate && outcome ? parseInt(outcome, 10) : null,
                meddra: !noEndDate && meddra ? parseInt(meddra, 10) : null
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(editPregnancyAPICall(body));
            this.setState({ editing: false });
        });
    }

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing
        }));
    }

    _handleToggleEndDate = ev => {
        this.setState({
            noEndDate: ev.target.checked
        });
    }

    _handleStartDateChange = date => {
        this.setState({ startDate: date });
    }

    _handleOutcomeDateChange = date => {
        this.setState({ outcomeDate: date });
    }

    _handleOutcomeChange = ev => {
        this.setState({ outcome: ev.target.value });
    }

    _handleToggleNoEndDate = ev => {
        this.setState({ noEndDate: ev.target.checked });
    }

    _handleMeddraChange = value => {
        this.setState({ meddra: value });
    }

    render() {
        const { editing, noEndDate, startDate, outcomeDate, outcome, meddra, startDate_original, outcomeDate_original, outcome_original, meddra_original } = this.state;
        const { data, outcomeHash, meddra_Hash, outcomes } = this.props;
        return (
            <div className={style.interruption}>
                {
                    editing ?
                        <>
                            <div className={style.newPregnancy}>
                                <label>Start date: </label><br /><PickDate startDate={startDate} handleChange={this._handleStartDateChange} /><br />
                                <label htmlFor='noEndDate'>The pregnancy is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                                {noEndDate ? null : (
                                    <>
                                        <label>Outcome date: </label><br /><PickDate startDate={outcomeDate} handleChange={this._handleOutcomeDateChange} /><br />
                                        <label>Outcome: </label><br /><SelectField value={outcome} options={outcomes} handler={this._handleOutcomeChange} name='outcome' /><br /><br />
                                        <label>MedDRA: </label><br /><MeddraPicker onChange={this._handleMeddraChange} value={meddra} key={`${data.id}${new Date().getMilliseconds}`} />
                                    </>
                                )}
                            </div>
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                            <br /><br />
                        </>
                        :
                        <>
                            <div key={`${startDate_original}`} className={style.pregnancy}>
                                <label>Start date: </label> {startDate_original._d.toDateString()} <br />
                                {outcomeDate_original ? (
                                    <>
                                        <label>Outcome date: </label> {outcomeDate_original._d.toDateString()} <br />
                                        <label>Outcome: </label> {outcome_original ? outcomeHash[outcome_original] : 'not entered'} <br />
                                        {meddra_original ? <><label>MedDRA: </label> {meddra_Hash[meddra_original] ? meddra_Hash[meddra_original].name : 'not entered'} <br /></> : null}
                                    </>
                                ) : null}
                                <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                                <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                            </div>
                        </>
                }
            </div>
        );
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
        store.dispatch(addAlert({ alert: `Are you sure you want to delete patient ${this.props.data.patientId}?`, handler: this._deleteFunction }));
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
                    <button onClick={this._handleClickDelete} className={style.deleteButton}>Delete this patient</button>
                </PatientProfileSectionScaffold>
            </>
        );
    }
}