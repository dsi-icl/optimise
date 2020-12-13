import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import Icon from '../icon';
import { PickDate } from '../createMedicalElements/datepicker';
import { PatientProfileSectionScaffold, DeleteButton, EditButton } from './sharedComponents';
import { formatRow } from './patientChart';
import store from '../../redux/store';
import { createImmunisationAPICall, deleteImmunisationAPICall, editImmunisationAPICall, } from '../../redux/actions/demographicData';
import { erasePatientAPICall, erasePatientReset } from '../../redux/actions/erasePatient';
import { getPatientPii, changePatientId } from '../../redux/actions/patientProfile';
import { updateConsentAPICall, updateParticipationAPICall } from '../../redux/actions/consent';
import { addAlert } from '../../redux/actions/alert';
import style from './patientProfile.module.css';

@connect(state => ({
    fetching: state.patientProfile.fetching,
    erasePatient: state.erasePatient
}))
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
                            <Pregnancy/>
                            <ImmunisationSection patientId={this.props.match.params.patientId} />
                            <DeletePatient match={this.props.match} />
                        </div>
                    </>
                );
            }
        }
    }
}

@connect(state => ({
    data: state.patientProfile.data ? state.patientProfile.data : {},
    pii: state.patientProfile.pii,
    fields: state.availableFields.demoFields[0]
}))
class DemographicSection extends Component {

    constructor() {
        super();
        this.state = { showPii: false, showEditAliasId: false, editAliasIdInput: '' };
        this._hidePii = this._hidePii.bind(this);
        this._queryPatientData = this._queryPatientData.bind(this);
        this._hideEditId = this._hideEditId.bind(this);
        this._showEditId = this._showEditId.bind(this);
        this._onChangeEditID = this._onChangeEditID.bind(this);
        this._submitEditId = this._submitEditId.bind(this);
    }

    _queryPatientData(ev) {
        ev.preventDefault();
        const body = {
            patient: this.props.data.id
        };
        this.setState({
            showPii: true,
        });
        if (!this.props.pii)
            store.dispatch(getPatientPii(body));
    }

    _hidePii() {
        this.setState({
            showPii: false,
        });
    }

    _hideEditId() {
        this.setState({
            showEditAliasId: false,
            editAliasIdInput: ''
        });
    }

    _showEditId() {
        this.setState({
            showEditAliasId: true
        });
    }

    _onChangeEditID(e) {
        this.setState({
            editAliasIdInput: e.target.value
        });
    }

    _submitEditId() {
        store.dispatch(changePatientId({
            data: {
                id: this.props.data.id,
                aliasId: this.state.editAliasIdInput
            },
            to: '/searchPatient'
        }));
    }


    render() {
        const { data: { demographicData }, pii, fields } = this.props;
        const { showEditAliasId, editAliasIdInput } = this.state;
        if (demographicData) {
            let { DOB, countryOfOrigin, dominantHand, ethnicity, gender } = demographicData;
            countryOfOrigin = fields['countries'].filter(el => el.id === countryOfOrigin)[0].value;
            dominantHand = fields['dominant_hands'].filter(el => el.id === dominantHand)[0].value;
            ethnicity = fields['ethnicities'].filter(el => el.id === ethnicity)[0].value;
            gender = fields['genders'].filter(el => el.id === gender)[0].value;

            return (
                <PatientProfileSectionScaffold sectionName='Profile' actions={
                    <EditButton to={`/patientProfile/${this.props.patientId}/edit/demographic/data`} />
                }>
                    <label>Date of birth:</label> {new Date(parseInt(DOB, 10)).toDateString()}<br />
                    <label>Gender:</label> <span>{gender}</span> <br />
                    <label>Dominant hand:</label> <span>{dominantHand}</span> <br />
                    <label>Ethnicity:</label> <span>{ethnicity}</span> <br />
                    <label>Country of origin:</label> <span>{countryOfOrigin}</span> <br />
                    <div onMouseLeave={this._hidePii} className={`${style.closePii} ${pii && this.state.showPii ? style.openPii : ''}`}>
                        <span onClick={this._queryPatientData} className={style.piiUncover}>Show Personally Identifiable Information</span>
                        {pii ?
                            <>
                                <br />
                                <label>First name:</label> <span>{pii.firstName}</span> <br />
                                <label>Surname:</label> <span>{pii.surname}</span> <br />
                                <label>Address:</label> <span>{pii.fullAddress}</span> <br />
                                <label>Postcode:</label> <span>{pii.postcode}</span>
                            </>
                            : null}
                    </div>
                    <br/>
                    {showEditAliasId ?
                        <div className={style.editPatientIdDiv}>
                            <b>Edit Patient ID</b>
                            <br/><br/>
                            <input onChange={this._onChangeEditID} value={editAliasIdInput}/>
                            <br/><br/>
                            <button onClick={this._submitEditId}>Submit</button>
                            <br/><br/>
                            <button onClick={this._hideEditId}>Cancel</button>
                            <p>Note: after changing patient ID you will be redirected to search tab.</p>
                        </div>
                        :
                        <span onClick={this._showEditId} className={style.piiUncover}>Edit Patient ID</span>
                    }
                </PatientProfileSectionScaffold>
            );
        } else {
            return <div>Please add demographic data via the API.</div>;
        }
    }
}

@connect(state => ({
    data: state.patientProfile.data
}))
class ImmunisationSection extends Component {
    constructor() {
        super();
        this.state = { addMore: false, newDate: moment(), newName: '' };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd() {
        this.setState(prevState => ({
            addMore: !prevState.addMore,
            newDate: moment(),
            newName: '',
            error: false
        }));
    }

    _handleInput(ev) {
        this.setState({
            newName: ev.target.value,
            error: false
        });
    }

    _handleDateChange(date) {
        this.setState({
            newDate: date,
            error: false
        });
    }

    _handleSubmit(ev) {

        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (this.state.newName === undefined || this.state.newName === null || this.state.newName === '') {
            return this.setState({
                error: 'Please indicate the vaccine name'
            });
        }

        if (!this.state.newDate || !this.state.newDate.isValid()) {
            return this.setState({
                error: 'Please indicated the immunisation date'
            });
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
        this.setState(prevState => ({
            newName: prevState.newName,
            lastSubmit: (new Date()).getTime(),
            error: false
        }), () => {
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
                        {data.immunisations.map(el => <OneImmunisation data={el} patientId={data.patientId}/>)}
                        {!this.state.addMore ? null : <tr className={style.immunisationNewItem}>
                            <td><input value={this.state.newName} onChange={this._handleInput} placeholder='vaccine name' name='vaccineName' type='text' /></td>
                            <td colSpan='2'><PickDate startDate={this.state.newDate} handleChange={this._handleDateChange} /></td>
                        </tr>}
                    </tbody>
                </table>
                {!this.state.addMore ?
                    <>
                        <br/>
                        <button onClick={this._handleClickingAdd}>Add immunisation</button>
                    </> :
                    <>
                        <br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button><br />
                    </>}
            </PatientProfileSectionScaffold>
        );
    }
}

class OneImmunisation extends Component {
    /* this.props.data  this.props.patientId */
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            newDate: moment(parseInt(this.props.data.immunisationDate)),
            error: undefined
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSave = this._handleSave.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            newDate: date,
            error: undefined
        });
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

    _handleSave() {
        if (!this.state.newDate || !this.state.newDate.isValid()) {
            this.setState({ error: 'Invalid date' });
        }
        const { data, patientId } = this.props;
        const body = {
            patientId,
            data: {
                id: data.id,
                immunisationDate: this.state.newDate.toISOString()
            }
        };
        store.dispatch(editImmunisationAPICall(body));
        this.setState({ editing: false });
    }

    render() {
        const el = this.props.data;

        if (this.state.editing) {
            return (
                <>
                    <tr key={el.vaccineName} className={style.immunisationItem}>
                        {formatRow([
                            el.vaccineName,
                            <PickDate startDate={this.state.newDate} handleChange={this._handleDateChange} />,
                            <button onClick={this._handleSave}>Save</button>
                        ])}
                    </tr>
                    {
                        this.state.error
                            ?
                            <tr><span>{this.state.error}</span></tr>
                            :
                            null
                    }
                </>
            );
        } else {
            return (
                <tr key={el.vaccineName} className={style.immunisationItem}>
                    {formatRow([
                        el.vaccineName,
                        new Date(parseInt(el.immunisationDate, 10)).toDateString(),
                        <div className={style.editButton} style={{ cursor: 'pointer' }}>
                            <div onClick={() => { this.setState({ editing: true }); }}>
                                <span title='Edit' className={style.dataEdit}><Icon symbol='edit' /></span>
                            </div>
                        </div>,
                        <DeleteButton clickhandler={() => this._handleClickDelete(el)} />
                    ])}
                </tr>
            );
        }

    }
}

@connect(state => ({
    data: state.patientProfile.data,
    fields: state.availableFields.diagnoses
}))
class PrimaryDiagnosis extends Component {
    render() {
        if (this.props.data.diagnosis.length === 0) {
            return (
                <PatientProfileSectionScaffold sectionName='Last Primary MS Diagnosis' actions={
                    <EditButton to={`/patientProfile/${this.props.patientId}/edit/diagnosis/data`} />
                }>
                    <i>No recorded diagnosis</i>
                </PatientProfileSectionScaffold>
            );
        }

        const diagnosis = this.props.data.diagnosis.sort((a, b) => parseInt(b.diagnosisDate) - parseInt(a.diagnosisDate))[0];
        if (!diagnosis) {
            return null;
        }

        const diagnosisName = this.props.fields.filter(el => el.id === diagnosis.diagnosis)[0];
        if (!diagnosisName) {
            return null;
        }

        return (
            <PatientProfileSectionScaffold sectionName='Last Primary MS Diagnosis' actions={
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


@connect(state => ({
    outcomeHash: state.availableFields.pregnancyOutcomes_Hash[0],
    data: state.patientProfile.data,
    meddra_Hash: state.availableFields.meddra_Hash[0]
}))
class Pregnancy extends Component {
    render() {

        if (this.props.data.demographicData) {
            if (this.props.data.demographicData.gender === 1)
                return null;
        }

        if (this.props.data.demographicData) {
            if (this.props.data.pregnancy.length === 0) {
                return (
                    <PatientProfileSectionScaffold sectionName='Last Pregnancy' actions={
                        <EditButton to={`/patientProfile/${this.props.data.patientId}/edit/pregnancy/data`} />
                    }>
                        <i>No recorded pregnancy</i>
                    </PatientProfileSectionScaffold>
                );
            }
        }
        const pregnancy = this.props.data.pregnancy.sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))[0];
        if (!pregnancy) {
            return null;
        }

        const outcomeName = this.props.outcomeHash[pregnancy.outcome];
        const MedDRAName = this.props.meddra_Hash[pregnancy.meddra];

        return (
            <PatientProfileSectionScaffold sectionName='Last Pregnancy' actions={
                <EditButton to={`/patientProfile/${this.props.data.patientId}/edit/pregnancy/data`} />
            }>
                <>
                    <label>Start date: </label> {moment(pregnancy.startDate, 'x')._d.toDateString()}
                    {pregnancy.outcomeDate && pregnancy.outcomeDate !== '' ? <> <br /><label>End date: </label> {moment(pregnancy.outcomeDate, 'x')._d.toDateString()}</> : null}
                    {outcomeName ? <> <br /><label>Outcome: </label> {outcomeName}</> : null}
                    {MedDRAName ? <> <br /><label>MedDRA: </label> {MedDRAName.name}</> : null}
                </>
            </PatientProfileSectionScaffold>
        );
    }
}


/**
 * @prop {Object} this.props.match
 */
@connect(state => ({
    data: state.patientProfile.data,
    priv: state.login.priv
}))
class DeletePatient extends Component {
    constructor() {
        super();
        this.state = { selectedConsentDate: moment() }; // consentdate is saved as 'study' in the database
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._handleClickWithdrawConsent = this._handleClickWithdrawConsent.bind(this);
        this._handleClickGivesConsent = this._handleClickGivesConsent.bind(this);
        this._handleClickWithdrawParticipation = this._handleClickWithdrawParticipation.bind(this);
        this._handleConsentDateChange = this._handleConsentDateChange.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    _handleClickDelete() {
        store.dispatch(addAlert({ alert: `Are you sure you want to delete patient ${this.props.data.patientId}?`, handler: this._deleteFunction }));
    }

    _handleConsentDateChange(date) {
        this.setState({
            selectedConsentDate: date
        });
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
        const { id } = this.props.data;
        const body = {
            patientId: this.props.match.params.patientId,
            data: {
                consent: false,
                study: moment().toISOString(),
                id: id
            }
        };
        store.dispatch(updateConsentAPICall(body));
    }

    _handleClickGivesConsent() {
        const { id } = this.props.data;
        const body = {
            patientId: this.props.match.params.patientId,
            data: {
                consent: true,
                study: this.state.selectedConsentDate.toISOString(),
                id: id
            }
        };
        store.dispatch(updateConsentAPICall(body));
    }

    _handleClickWithdrawParticipation() {
        const { participation, id } = this.props.data;
        const body = {
            patientId: this.props.match.params.patientId,
            data: {
                participation: !participation,
                id: id
            }
        };
        store.dispatch(updateParticipationAPICall(body));
    }


    render() {
        const { consent, participation, study } = this.props.data;

        return (
            <>
                <PatientProfileSectionScaffold sectionName='Study participation'>
                    <button onClick={this._handleClickWithdrawParticipation} >{participation ? 'This patient withdraws from the study' : 'This patient re-enrolls in the study'}</button>
                </PatientProfileSectionScaffold>
                <PatientProfileSectionScaffold sectionName='Consent'>

                    {
                        consent ?
                        <div>
                            <span><b>Consent date</b>: {new Date(study).toLocaleDateString()}</span>
                            <button onClick={this._handleClickWithdrawConsent} >This patient withdraws consent</button>
                            <br/> <br/>
                            <span>Select date of consent:</span>
                            <PickDate startDate={this.state.selectedConsentDate} handleChange={this._handleConsentDateChange} />
                            <button onClick={this._handleClickGivesConsent}>Change consent date</button>
                        </div>
                        :
                        <div>
                            <span>Select date of consent:</span>
                            <PickDate startDate={this.state.selectedConsentDate} handleChange={this._handleConsentDateChange} />
                            <button onClick={this._handleClickGivesConsent}>Patient gives consent</button>
                        </div>
                    }


                </PatientProfileSectionScaffold>
                {this.props.priv === 1 ?
                    (
                        <PatientProfileSectionScaffold sectionName='Delete'>
                            <button onClick={this._handleClickDelete} className={style.deleteButton}>Delete this patient</button>
                        </PatientProfileSectionScaffold>
                    )
                    : null
                }
            </>
        );
    }
}
