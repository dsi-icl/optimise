import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from './utils';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { MeddraPicker } from '../meDRA/meddraPicker';
import { createTreatmentInterruptionAPICall, deleteTreatmentInterruptionAPICall, editTreatmentInterruptionAPICall } from '../../redux/actions/treatments';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({ patientProfile: state.patientProfile, fields: state.availableFields }))
export class TreatmentInterruption extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            newStartDate: moment(),
            newEndDate: moment(),
            noEndDate: false,
            error: false,
            meddra: undefined
        };
        this.reasonRef = React.createRef();
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
    }


    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: '', error: false });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value, error: false });
    }

    _handleMeddraChange(value) {
        this.setState({ meddra: value });
    }


    _handleStartDateChange(date) {
        this.setState({
            newStartDate: date,
            error: false
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            newEndDate: date,
            error: false
        });
    }

    _handleToggleNoEndDate(ev) {
        this.setState({ noEndDate: ev.target.checked, error: false });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                treatmentId: parseInt(this.props.match.params.elementId, 10),
                start_date: this.state.newStartDate.toISOString(),
                end_date: !this.state.noEndDate && this.state.newEndDate ? this.state.newEndDate.toISOString() : undefined,
                reason: parseInt(this.reasonRef.current.value, 10),
                meddra: this.state.meddra
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(createTreatmentInterruptionAPICall(body));
            this.setState({ addMore: false });
        });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { interruptionReasons, meddra_Hash } = fields;
        if (!patientProfile.fetching) {
            const { params } = this.props.match;
            const treatmentsFiltered = patientProfile.data.treatments.filter(el => el.id === parseInt(params.elementId, 10));
            if (treatmentsFiltered.length !== 0) {
                const treatment = treatmentsFiltered[0];
                return (
                    <>
                        <div className={style.ariane}>
                            <h2>Treatment Interuption</h2>
                            <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                        </div>
                        <form className={style.panel}>
                            {treatment.interruptions.map((el) =>
                                <OneTreatmentInterruption
                                    key={el.id}
                                    data={el}
                                    interruptionReasons={interruptionReasons}
                                    meddra_Hash={meddra_Hash}
                                    _handleClickDelete={this._handleClickDelete}
                                    patientId={patientProfile.data.patientId}
                                />
                            )}


                            {!this.state.addMore ?
                                <>
                                    <br />
                                    <button onClick={this._handleClickingAdd}>Add interruptions</button>
                                </>
                                :
                                <>
                                    <div className={style.newInterruption}>
                                        <label>Start date: </label><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br />
                                        <label htmlFor='noEndDate'>The interruption is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={this.state.noEndDate} /><br />
                                        {this.state.noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={!this.state.noEndDate ? this.state.newEndDate : null} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                                        <label>Reason: </label>
                                        <select ref={this.reasonRef}>
                                            {interruptionReasons.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                        </select><br /><br />
                                        <b>MedDRA: </b><MeddraPicker key={params.elementId} value={this.state.meddra} onChange={this._handleMeddraChange} /><br />
                                    </div>
                                    <br />
                                    {this.state.error ? <><div className={style.error}> Your medDRA code is not a permitted value.</div><br /></> : null}
                                    <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                    <button onClick={this._handleClickingAdd}>Cancel</button><br />
                                </>}
                        </form>
                    </>
                );
            } else {
                return <div>We cannot find this treatment!</div>;
            }
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}


class OneTreatmentInterruption extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            startDate: moment(parseInt(data.startDate)),
            noEndDate: data.endDate ? false : true,
            endDate: data.endDate ? moment(parseInt(data.endDate)) : moment(),
            reason: data.reason,
            meddra: data.meddra,
            startDate_original: moment(parseInt(data.startDate)),
            endDate_original: data.endDate ? moment(parseInt(data.endDate)) : null,
            reason_original: data.reason,
            meddra_original: data.meddra,
        };
    }

    _handleClickDelete = () => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this interruption record?', handler: this._deleteFunction(this.props.data.id) }));
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
            store.dispatch(deleteTreatmentInterruptionAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                treatmentId: parseInt(data.id, 10),
                start_date: this.state.startDate.toISOString(),
                end_date: !this.state.noEndDate && this.state.endDate ? this.state.endDate.toISOString() : null,
                reason: parseInt(this.state.reason, 10),
                meddra: this.state.meddra
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(editTreatmentInterruptionAPICall(body));
            this.setState({ editing: false });
        });
    }

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing
        }));
    }

    _handleStartDateChange = date => {
        this.setState({ startDate: date });
    }

    _handleEndDateChange = date => {
        this.setState({ endDate: date });
    }

    _handleToggleNoEndDate = ev => {
        this.setState({ noEndDate: ev.target.checked });
    }

    _handleReasonChange = ev => {
        this.setState({ reason: ev.target.value });
    }

    _handleMeddraChange = value => {
        this.setState({ meddra: value });
    }

    render() {
        const { editing, startDate, endDate, noEndDate, reason, meddra, startDate_original, endDate_original, reason_original, meddra_original } = this.state;
        const { data, interruptionReasons, meddra_Hash } = this.props;
        return (
            <div className={style.interruption}>
                {
                    editing ?
                        <>
                        <div className={style.editInterruption}>
                            <label>Start date: </label><PickDate startDate={startDate} handleChange={this._handleStartDateChange} /><br />
                            <label htmlFor='noEndDate'>The interruption is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={noEndDate} /><br />
                            {noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={!noEndDate ? endDate : null} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                            <label>Reason: </label>
                            <select onChange={this._handleReasonChange} value={reason}>
                                {interruptionReasons.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                            </select><br /><br />
                            <b>MedDRA: </b><MeddraPicker key={data.id} value={meddra} onChange={this._handleMeddraChange} /><br />
                        </div>
                        <br />
                        <button onClick={this._handleSubmit}>Confirm change</button><br/><br/>
                        <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                        <label>Start date: </label> {startDate_original._d.toDateString()} <br />
                        {endDate_original ? <><label>End date: </label> {endDate_original._d.toDateString()}<br /></> : null}
                        <label>Reason: </label> {interruptionReasons.filter(ele => ele.id === reason_original)[0].value} <br />
                        {meddra_original ? <><label>MedDRA: </label> {meddra_Hash[0][meddra_original].name} <br /></> : null}
                        <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                        <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        )
    }
}