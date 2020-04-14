import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from './utils';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { MeddraPicker } from '../medDRA/meddraPicker';
import { createTreatmentInterruptionAPICall, deleteTreatmentInterruptionAPICall, editTreatmentInterruptionAPICall } from '../../redux/actions/treatments';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({
    patientProfile: state.patientProfile,
    fields: state.availableFields
}))
export class TreatmentInterruption extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            newStartDate: moment(),
            newEndDate: moment(),
            noEndDate: true,
            error: false,
            reason: 'unselected',
            meddra: undefined
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
        this._handleReasonChange = this._handleReasonChange.bind(this);
    }


    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore, error: false }));
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

    _handleReasonChange(ev) {
        this.setState({
            reason: ev.target.value,
            error: false
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.newStartDate || !this.state.newStartDate.isValid()) {
            this.setState({
                error: 'Please select a start date'
            });
            return;
        }
        if (!this.state.noEndDate && (!this.state.newEndDate || !this.state.newEndDate.isValid())) {
            this.setState({
                error: 'Please select an end date'
            });
            return;
        }
        if (!this.state.reason || this.state.reason === 'unselected') {
            this.setState({
                error: 'Please select a reason'
            });
            return;
        }
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                treatmentId: parseInt(this.props.match.params.elementId, 10),
                start_date: this.state.newStartDate ? this.state.newStartDate.toISOString() : null,
                end_date: !this.state.noEndDate && this.state.newEndDate ? this.state.newEndDate.toISOString() : null,
                reason: parseInt(this.state.reason, 10),
                meddra: this.state.meddra
            },
            to: this.props.renderedInFrontPage ? `${this.props.location.pathname}${this.props.location.search}` : undefined
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(createTreatmentInterruptionAPICall(body));
            this.setState({ addMore: false });
        });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { interruptionReasons, meddra_Hash } = fields;

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        if (!patientProfile.fetching) {
            const { params } = this.props.match;
            const treatmentsFiltered = patientProfile.data.treatments.filter(el => el.id === parseInt(params.elementId, 10));
            const treatment = treatmentsFiltered ? treatmentsFiltered[0] : null;
            return (
                <>
                    <div className={_style.ariane}>
                        <h2>Treatment Interruptions</h2>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                    </div>
                    <form className={_style.panel}>
                        {treatment ?
                            <>
                                {treatment.interruptions.map((el) =>
                                    <OneTreatmentInterruption
                                        key={Math.random()}
                                        data={el}
                                        interruptionReasons={interruptionReasons}
                                        meddra_Hash={meddra_Hash}
                                        _handleClickDelete={this._handleClickDelete}
                                        patientId={patientProfile.data.patientId}
                                        location={this.props.location}
                                        renderedInFrontPage={this.props.renderedInFrontPage}
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
                                            {this.state.noEndDate ? null : (
                                                <>
                                                    <label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.newEndDate} handleChange={this._handleEndDateChange} />
                                                    <br /><br />
                                                </>
                                            )}
                                            <label>Reason: </label>
                                            <select value={this.state.reason} onChange={this._handleReasonChange}>
                                                <option value='unselected'></option>
                                                {interruptionReasons.sort((a, b) => a.value.localeCompare(b.value)).map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                            </select><br /><br />
                                            <label>MedDRA: </label><MeddraPicker key={params.elementId} value={this.state.meddra} onChange={this._handleMeddraChange} /><br />
                                        </div>
                                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                        <button onClick={this._handleClickingAdd}>Cancel</button><br />
                                    </>}
                            </>
                            :
                            <div>
                                <i>We could not find the treatment that you are looking for.</i>
                            </div>
                        }
                    </form>
                </>
            );
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
            error: false,
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
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleReasonChange = this._handleReasonChange.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
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
                },
                to: that.props.renderedInFrontPage ? `${that.props.location.pathname}${that.props.location.search}` : undefined
            };
            store.dispatch(deleteTreatmentInterruptionAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.startDate || !this.state.startDate.isValid()) {
            this.setState({
                error: 'Please select a start date'
            });
            return;
        }
        if (!this.state.noEndDate && (!this.state.endDate || !this.state.endDate.isValid())) {
            this.setState({
                error: 'Please select an end date'
            });
            return;
        }
        if (!this.state.reason || this.state.reason === 'unselected') {
            this.setState({
                error: 'Please select a reason'
            });
            return;
        }
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                treatmentInterId: parseInt(data.id, 10),
                start_date: this.state.startDate ? this.state.startDate.toISOString() : null,
                end_date: !this.state.noEndDate && this.state.endDate ? this.state.endDate.toISOString() : null,
                reason: parseInt(this.state.reason, 10),
                meddra: this.state.meddra
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editTreatmentInterruptionAPICall(body));
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
            startDate: date,
            error: false
        });
    }

    _handleEndDateChange = date => {
        this.setState({
            endDate: date,
            error: false
        });
    }

    _handleToggleNoEndDate = ev => {
        this.setState({
            noEndDate: ev.target.checked,
            error: false
        });
    }

    _handleReasonChange = ev => {
        this.setState({
            reason: ev.target.value,
            error: false
        });
    }

    _handleMeddraChange = value => {
        this.setState({
            meddra: value,
            error: false
        });
    }

    render() {
        const { editing, startDate, endDate, noEndDate, reason, meddra, startDate_original, endDate_original, reason_original, meddra_original } = this.state;
        const { data, interruptionReasons, meddra_Hash } = this.props;
        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <div className={style.editInterruption}>
                                <label>Start date: </label><PickDate startDate={startDate} handleChange={this._handleStartDateChange} /><br />
                                <label htmlFor='noEndDate'>The interruption is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={noEndDate} /><br />
                                {noEndDate ? null : (
                                    <>
                                        <label htmlFor='endDate'>End date: </label><PickDate startDate={endDate} handleChange={this._handleEndDateChange} />
                                        <br /><br />
                                    </>
                                )}
                                <label>Reason: </label>
                                <select onChange={this._handleReasonChange} value={reason}>
                                    <option value='unselected'></option>
                                    {interruptionReasons.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                </select><br /><br />
                                <label>MedDRA: </label><MeddraPicker key={data.id} value={meddra} onChange={this._handleMeddraChange} /><br />
                            </div>
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                            <label>Start date: </label> {startDate_original._d.toDateString()} <br />
                            {endDate_original ? <><label>End date: </label> {endDate_original._d.toDateString()}<br /></> : null}
                            {reason_original ? <><label>Reason: </label> {interruptionReasons.sort((a, b) => a.value.localeCompare(b.value)).filter(ele => ele.id === reason_original)[0].value} <br /></> : null}
                            {meddra_original ? <><label>MedDRA: </label> {meddra_Hash[0][meddra_original].name} <br /></> : null}
                            <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}