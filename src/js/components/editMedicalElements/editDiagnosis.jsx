import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import { updateDiagnosisAPICall } from '../../redux/actions/demographicData';
import moment from 'moment';

@connect(state => ({ CEs: state.patientProfile.data.clinicalEvents }))
export default class EditDiagnosis extends Component {
    render() {
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Primary diagnosis</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <UpdateDiagnosisEntry />
                </form>
            </>
        );
    }
}


@connect(state => ({ patientId: state.patientProfile.data.patientId, diagnosis: state.patientProfile.data.diagnosis ? state.patientProfile.data.diagnosis[0] : {}, fields: state.availableFields.diagnoses }))
class UpdateDiagnosisEntry extends Component {
    constructor() {
        super();
        this.state = {
            date: moment(),
            diagnosisRef: React.createRef()
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            date: date
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { patientId, diagnosis } = this.props;
        const { id } = diagnosis;
        const { date, diagnosisRef } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                diagnosisDate: date.toISOString(),
                diagnosis: parseInt(diagnosisRef.current.value),
            }
        };
        store.dispatch(updateDiagnosisAPICall(body));
    }

    render() {
        const { date, diagnosisRef } = this.state;
        const { diagnosis } = this.props.diagnosis;
        const { fields } = this.props;
        return (
            <>
                <label>Diagnosis date: </label>
                <PickDate startDate={date} handleChange={this._handleDateChange} />
                <br />
                <label>Diagnosis: </label>
                <select defaultValue={diagnosis} ref={diagnosisRef}>
                    {fields.map(el => <option value={el.id} key={el.id}>{el.value}</option>)}
                </select>
                <br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}