import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/utils';
import store from '../../redux/store';
import { createPatientCall } from '../../redux/actions/createPatient';
import style from './createPatient.module.css';

@connect(state => ({
    diagnosesfields: state.availableFields.diagnoses,
    demofields: state.availableFields.demoFields[0],
    patientId: state.createPatient.patientId,
}))
export default class CreatePatient extends Component {    //get these props from state: this.props.visitFields, this.props.patientId
    constructor(props) {
        super(props);
        this.state = {
            dispatched: false,
            aliasId: props.match ? props.match.params.patientIdCreated : '',
            referer: props.match ? props.match.url : undefined,
            givenName: '',
            surname: '',
            address: '',
            postcode: '',
            DOB: moment(),
            consent: 'N',
            error: false,
            gender: 0,
            dominant_hand: 0,
            ethnicity: 0,
            country_of_origin: 0,
            diagnosis: 0,
            diagnosisDate: moment()
        };
        this._handleDobDateChange = this._handleDobDateChange.bind(this);
        this._handleDiagnosisDateChange = this._handleDiagnosisDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleConsentChange = this._handleConsentChange.bind(this);
        this._handleFreeTextChange = this._handleFreeTextChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let newReferer = nextProps.match ? nextProps.match.url : '';
        let newPatient = nextProps.match ? nextProps.match.params.patientIdCreated : '';
        if (prevState.referer !== newReferer)
            return { ...prevState, referer: newReferer, aliasId: newPatient };
        return prevState;
    }

    _handleDobDateChange(date) {
        this.setState({
            DOB: date,
            error: false
        });
    }

    _handleDiagnosisDateChange(date) {
        this.setState({
            diagnosisDate: date,
            error: false
        });
    }

    _handleChange(ev) {
        const newState = { error: false };
        newState[ev.target.name] = parseInt(ev.target.value, 10);
        this.setState(newState);
    }

    _handleConsentChange(ev) {
        const newState = { error: false };
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleFreeTextChange(ev) {
        const newState = { error: false };
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const fieldCheck = ['DOB', 'address', 'aliasId', 'consent', 'country_of_origin', 'diagnosis', 'diagnosisDate', 'dominant_hand', 'ethnicity', 'gender', 'givenName', 'postcode', 'surname'];
        for (let i = 0; i < fieldCheck.length; i++) {
            if (this.state[fieldCheck[i]] === 0 || this.state[fieldCheck[i]] === null || this.state[fieldCheck[i]] === '' || this.state[fieldCheck[i]] === 'unselected') {
                this.setState({ error: 'None of the fields can be empty!' });
                return;
            }
        }

        const DOBValidator = this.state.DOB ? this.state.DOB.isValid() : false;
        const diagnosisDateValidator = this.state.diagnosisDate ? this.state.diagnosisDate.isValid() : false;

        if (!DOBValidator || !diagnosisDateValidator) {
            this.setState({ error: 'Invalid dates provided' });
            return;
        }

        const demoData = {
            DOB: this.state.DOB.toISOString(),
            gender: this.state.gender,
            dominant_hand: this.state.dominant_hand,
            ethnicity: this.state.ethnicity,
            country_of_origin: this.state.country_of_origin,
        };
        const PIIData = {
            firstName: this.state.givenName,
            surname: this.state.surname,
            fullAddress: this.state.address,
            postcode: this.state.postcode,
        };
        const diagnosisData = {
            diagnosis: this.state.diagnosis,
            diagnosisDate: this.state.diagnosisDate.toISOString()
        };
        const patientData = {
            aliasId: this.state.aliasId,
            consent: this.state.consent === 'Y' ? true : false,
            study: 'optimise'
        };
        const body = {
            patientData: patientData,
            demoData: demoData,
            patientId: this.state.aliasId,
            diagnosisData: diagnosisData,
            PIIData: PIIData
        };

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(createPatientCall(body));
            this.setState({ dispatched: true });
        });

    }

    render() {
        if (!this.state.dispatched) {
            const { genders, dominant_hands, ethnicities, countries } = this.props.demofields;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>+ New Patient Profile</h2>
                        <BackButton to={'/searchPatient'} />
                    </div>
                    <div className={style.panel}>
                        <form onSubmit={this._handleSubmit}>
                            <label htmlFor='aliasId'>Patient ID:</label> <br /> <input value={this.state.aliasId} name='aliasId' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                            <h4>Personal information</h4><br />
                            <label htmlFor='givenName'>Given name:</label><br /> <input value={this.state.givenName} name='givenName' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                            <label htmlFor='surname'>Surname:</label><br /> <input value={this.state.surname} name='surname' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                            <label htmlFor='address'>Full Address:</label><br /><input value={this.state.address} name='address' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                            <label htmlFor='postcode'>Postcode:</label><br /> <input value={this.state.postcode} name='postcode' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                            <br />
                            <h4>Consent</h4><br />
                            <label htmlFor='consent'>Does the patient give consent for sharing:</label><br />
                            <select name='consent' value={this.state.consent} onChange={this._handleConsentChange} autoComplete='off'>
                                <option value='Y'>Yes</option>
                                <option value='N'>No</option>
                            </select><br /><br />
                            <br />
                            <h4>Basic demographic data</h4><br />
                            <label>Date of birth:</label><br /> <PickDate startDate={this.state.DOB} handleChange={this._handleDobDateChange} /> <br /><br />
                            <label htmlFor='gender'>Gender:</label><br /> <SelectField name='gender' value={this.state.gender} options={genders} handler={this._handleChange} /> <br /><br />
                            <label htmlFor='dominant_hand'>Dominant hand:</label><br /> <SelectField name='dominant_hand' value={this.state['dominant_hand']} options={dominant_hands} handler={this._handleChange} /> <br /><br />
                            <label htmlFor='ethnicity'>Ethnicity:</label><br /> <SelectField name='ethnicity' value={this.state['ethnicity']} options={ethnicities} handler={this._handleChange} /> <br /><br />
                            <label htmlFor='country_of_origin'>Country of origin:</label><br /> <SelectField name='country_of_origin' value={this.state['country_of_origin']} options={countries} handler={this._handleChange} /> <br /><br />
                            <br />
                            <h4>Primary MS diagnosis</h4><br />
                            <label>Diagnosis date:</label><br /> <PickDate startDate={this.state.diagnosisDate} handleChange={this._handleDiagnosisDateChange} /> <br /><br />
                            <label htmlFor='diagnosis'>Diagnosis:</label><br /> <SelectField name='diagnosis' value={this.state['diagnosis']} options={this.props.diagnosesfields} handler={this._handleChange} /> <br /><br />
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button type="submit">Submit</button>
                        </form>
                        <br />
                    </div>
                </>
            );
        } else {
            return <Redirect to={`/patientProfile/${this.state.aliasId}`} />;
        }
    }
}


/**
* @prop {string} this.props.name - field name
* @prop {string} this.props.value - value (usually passed from state of parent)
* @prop {Array} this.props.options - list of options to be rendered; each option would be {id: x, value: 'abc'}
* @prop {Function} this.props.handler - event listener passed down by parent to change the state of parent
            */
export class SelectField extends Component {
    render() {
        return (
            <select onChange={this.props.handler} name={this.props.name} value={this.props.value} autoComplete='off'>
                <option value={0}></option>
                {this.props.options.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
            </select>
        );
    }
}