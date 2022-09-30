import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import { updatePatientCall } from '../../redux/actions/createPatient';
import { getPatientPii } from '../../redux/actions/patientProfile';

@connect(state => ({
    CEs: state.patientProfile.data.clinicalEvents
    }))
class EditDemo extends Component {

    render() {
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Patient information</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <UpdateDemoEntry />
                </form>
            </>
        );
    }
}

export default EditDemo;

@connect(state => ({
    id: state.patientProfile.data.id,
    patientId: state.patientProfile.data.patientId,
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data.demographicData,
    pii: state.patientProfile.pii,
    fields: state.availableFields.demoFields[0]
    }))
class UpdateDemoEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countryOfOriginRef: React.createRef(),
            dominantHandRef: React.createRef(),
            ethnicityRef: React.createRef(),
            genderRef: React.createRef(),
            hasPII: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDobDateChange = this._handleDobDateChange.bind(this);
        this._handleFreeTextChange = this._handleFreeTextChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (prevState.hasPII === false && nextProps.pii !== undefined) {
            return {
                ...prevState,
                hasPII: true,
                givenName: nextProps.pii.firstName,
                surname: nextProps.pii.surname,
                address: nextProps.pii.fullAddress,
                postcode: nextProps.pii.postcode
            };
        }
        return prevState;
    }

    _handleDobDateChange(date) {
        this.setState({
            DOB: date,
            error: false
        });
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

        const { patientId } = this.props;
        const { countryOfOriginRef, dominantHandRef, ethnicityRef, genderRef } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            demoData: {
                id: this.props.data ? this.props.data.id : null,
                DOB: this.state.DOB ? this.state.DOB.toISOString() : this.props.data.DOB ? moment(this.props.data.DOB, 'x').toISOString() : null,
                countryOfOrigin: parseInt(countryOfOriginRef.current.value),
                dominantHand: parseInt(dominantHandRef.current.value),
                ethnicity: parseInt(ethnicityRef.current.value),
                gender: parseInt(genderRef.current.value)
            },
            PIIData: {
                id: this.props.pii ? this.props.pii.id : null,
                firstName: this.state.givenName,
                surname: this.state.surname,
                fullAddress: this.state.address,
                postcode: this.state.postcode
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(updatePatientCall(body));
        });
    }

    _queryPatientData() {
        if (this.props.id === undefined)
            return;

        const body = {
            patient: this.props.id
        };
        if (!this.props.pii)
            store.dispatch(getPatientPii(body));
    }

    componentDidMount() {
        this._queryPatientData();
    }

    componentDidUpdate() {
        this._queryPatientData();
    }

    render() {
        const { countryOfOriginRef, dominantHandRef, ethnicityRef, genderRef } = this.state;
        const { fields, fetching } = this.props;
        if (fetching || !this.props.pii) {
            return null;
        }
        const { countryOfOrigin, dominantHand, ethnicity, gender, DOB } = this.props.data;
        const { givenName, surname, address, postcode } = this.state;

        let genders_sorted = [];
        fields.genders.forEach((el) => {
            el.value = el.value[0].toUpperCase() + el.value.slice(1).toLowerCase();
            genders_sorted.push(el);
        });
        let dominant_hands_sorted = [];
        fields.dominant_hands.forEach((el) => {
            el.value = el.value[0].toUpperCase() + el.value.slice(1).toLowerCase();
            if (el.value === 'Unknown')
                dominant_hands_sorted.unshift(el);
            else
                dominant_hands_sorted.push(el);
        });
        return (
            <>
                <h4>Personal information</h4><br />
                <label htmlFor='givenName'>Given name:</label><br /> <input value={givenName} name='givenName' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                <label htmlFor='surname'>Surname:</label><br /> <input value={surname} name='surname' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                <label htmlFor='address'>Full Address:</label><br /><input value={address} name='address' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />
                <label htmlFor='postcode'>Postcode:</label><br /> <input value={postcode} name='postcode' onChange={this._handleFreeTextChange} autoComplete='off' /><br /><br />

                <h4>Basic demographic data</h4><br />
                <label>Date of birth:</label><br /> <PickDate startDate={moment(DOB, 'x')} handleChange={this._handleDobDateChange} /> <br /><br />
                <label>Gender: </label>
                <select defaultValue={gender} ref={genderRef}>
                    {genders_sorted.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <label>Dominant hand: </label>
                <select defaultValue={dominantHand} ref={dominantHandRef}>
                    {dominant_hands_sorted.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <label>Ethnicity: </label>
                <select defaultValue={ethnicity} ref={ethnicityRef}>
                    {fields.ethnicities.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <label>Country of origin: </label>
                <select defaultValue={countryOfOrigin} ref={countryOfOriginRef}>
                    {fields.countries.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}