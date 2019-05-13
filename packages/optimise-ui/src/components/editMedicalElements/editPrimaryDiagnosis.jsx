import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { createDiagnosisAPICall, deleteDiagnosisAPICall, updateDiagnosisAPICall } from '../../redux/actions/demographicData';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({
    patientProfile: state.patientProfile,
    fields: state.availableFields
}))
export default class EditPrimaryDiagnoses extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            diagnosisDate: moment(),
            diagnosis: 'unselected',
            error: false
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleDiagnosisChange = this._handleDiagnosisChange.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: '', error: false });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value, error: false });
    }

    _handleStartDateChange(date) {
        this.setState({
            diagnosisDate: date,
            error: false
        });
    }

    _handleDiagnosisChange(ev) {
        this.setState({
            diagnosis: ev.target.value,
            error: false
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.diagnosisDate) {
            this.setState({
                error: 'Please select a diagnosis date'
            });
            return;
        }
        if (!this.state.diagnosis || this.state.diagnosis === 'unselected') {
            this.setState({
                error: 'Please select a diagnosis'
            });
            return;
        }

        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                patient: parseInt(data.id, 10),
                diagnosisDate: this.state.diagnosisDate ? this.state.diagnosisDate.toISOString() : null,
                diagnosis: parseInt(this.state.diagnosis, 10),
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(createDiagnosisAPICall(body));
            this.setState({ addMore: false });
        });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { diagnoses } = fields;
        if (!patientProfile.fetching) {
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Primary MS Diagnoses</h2>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        {patientProfile.data.diagnosis
                            .sort((a, b) => parseInt(a.diagnosisDate) - parseInt(b.diagnosisDate))
                            .map((el) =>
                                <OneEditPrimaryDiagnoses
                                    key={Math.random()}
                                    data={el}
                                    diagnoses={diagnoses}
                                    _handleClickDelete={this._handleClickDelete}
                                    patientId={patientProfile.data.patientId}
                                />
                            )}
                        {!this.state.addMore ?
                            <>
                                <br />
                                <button onClick={this._handleClickingAdd}>Add diagnoses</button>
                            </>
                            :
                            <>
                                <div className={style.newInterruption}>
                                    <label>Diagnosis date: </label><PickDate startDate={this.state.diagnosisDate} handleChange={this._handleStartDateChange} /><br /><br />
                                    <label>Diagnosis: </label>
                                    <select value={this.state.diagnosis} onChange={this._handleDiagnosisChange}>
                                        <option value='unselected'></option>
                                        {diagnoses.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                    </select><br /><br />
                                </div>
                                {this.state.error ? <><div className={style.error}> {this.state.error} </div><br /></> : null}
                                <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                <button onClick={this._handleClickingAdd}>Cancel</button><br />
                            </>}
                    </form>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}

class OneEditPrimaryDiagnoses extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            error: false,
            diagnosisDate: moment(parseInt(data.diagnosisDate)),
            diagnosis: data.diagnosis,
            diagnosisDate_original: moment(parseInt(data.diagnosisDate)),
            diagnosis_original: data.diagnosis,
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleDiagnosisChange = this._handleDiagnosisChange.bind(this);
    }

    _handleClickDelete = () => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this diagnosis record?', handler: this._deleteFunction(this.props.data.id) }));
    }

    _deleteFunction = id => {
        const that = this;
        return () => {
            const { patientId } = that.props;
            const body = {
                patientId: patientId,
                data: {
                    treatmentInterId: id
                }
            };
            store.dispatch(deleteDiagnosisAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.diagnosisDate || !this.state.diagnosisDate.isValid()) {
            this.setState({
                error: 'Please select a diagnosis date'
            });
            return;
        }
        if (!this.state.diagnosis || this.state.diagnosis === 'unselected') {
            this.setState({
                error: 'Please select a diagnosis'
            });
            return;
        }
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                id: parseInt(data.id, 10),
                diagnosisDate: this.state.diagnosisDate ? this.state.diagnosisDate.toISOString() : null,
                diagnosis: parseInt(this.state.diagnosis, 10)
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(updateDiagnosisAPICall(body));
            this.setState({ editing: false });
        });
    }

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing,
            error: false
        }));
    }

    _handleStartDateChange = date => {
        this.setState({
            diagnosisDate: date,
            error: false
        });
    }

    _handleDiagnosisChange = ev => {
        this.setState({
            diagnosis: ev.target.value,
            error: false
        });
    }

    render() {
        const { editing, diagnosisDate, diagnosis, diagnosisDate_original, diagnosis_original } = this.state;
        const { data, diagnoses } = this.props;

        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <div className={style.editInterruption}>
                                <label>Diagnosis date: </label><PickDate startDate={diagnosisDate} handleChange={this._handleStartDateChange} /><br /><br />
                                <label>Diagnosis: </label>
                                <select onChange={this._handleDiagnosisChange} value={diagnosis}>
                                    <option value='unselected'></option>
                                    {diagnoses.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                </select><br /><br />
                            </div>
                            {this.state.error ? <><div className={style.error}> {this.state.error} </div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                            <label>Diagnosis date: </label> {diagnosisDate_original._d.toDateString()} <br />
                            <label>Diagnosis: </label> {diagnoses.filter(ele => ele.id === diagnosis_original)[0].value} <br />
                            <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}