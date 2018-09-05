import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import { updateDemographicAPICall } from '../../redux/actions/demographicData';

@connect(state => ({ CEs: state.patientProfile.data.clinicalEvents }))
export default class EditDemo extends Component {
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


@connect(state => ({ id: state.patientProfile.data.id, patientId: state.patientProfile.data.patientId, fetching: state.patientProfile.fetching, data: state.patientProfile.data.demographicData, fields: state.availableFields.demoFields[0] }))
class UpdateDemoEntry extends Component {
    constructor() {
        super();
        this.state = {
            alcoholUsageRef: React.createRef(),
            countryOfOriginRef: React.createRef(),
            dominantHandRef: React.createRef(),
            ethnicityRef: React.createRef(),
            genderRef: React.createRef(),
            smokingHistoryRef: React.createRef()
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDobDateChange = this._handleDobDateChange.bind(this);
    }

    _handleDobDateChange(date) {
        this.setState({
            DOB: date,
            error: false
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const { patientId, id } = this.props;
        const { alcoholUsageRef, countryOfOriginRef, dominantHandRef, ethnicityRef, genderRef, smokingHistoryRef } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                DOB: this.state.DOB ? this.state.DOB.toISOString() : null,
                alcoholUsage: parseInt(alcoholUsageRef.current.value),
                countryOfOrigin: parseInt(countryOfOriginRef.current.value),
                dominantHand: parseInt(dominantHandRef.current.value),
                ethnicity: parseInt(ethnicityRef.current.value),
                gender: parseInt(genderRef.current.value),
                smokingHistory: parseInt(smokingHistoryRef.current.value)
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(updateDemographicAPICall(body));
        });
    }

    render() {
        const { alcoholUsageRef, countryOfOriginRef, dominantHandRef, ethnicityRef, genderRef, smokingHistoryRef } = this.state;
        const { fields, fetching } = this.props;
        if (fetching) {
            return null;
        }
        const { alcoholUsage, countryOfOrigin, dominantHand, ethnicity, gender, smokingHistory, DOB } = this.props.data;
        return (
            <>
                <h4>Basic demographic data</h4><br />
                <label>Date of birth:</label><br /> <PickDate startDate={moment(DOB, 'x')} handleChange={this._handleDobDateChange} /> <br />
                <label>Gender: </label>
                <select defaultValue={gender} ref={genderRef}>
                    {fields.genders.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <label>Dominant hand: </label>
                <select defaultValue={dominantHand} ref={dominantHandRef}>
                    {fields.dominant_hands.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
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
                <label>Alcohol usage: </label>
                <select defaultValue={alcoholUsage} ref={alcoholUsageRef}>
                    {fields.alcohol_usage.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <label>Smoking history: </label>
                <select defaultValue={smokingHistory} ref={smokingHistoryRef}>
                    {fields.smoking_history.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}