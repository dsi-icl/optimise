import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { MeddraPicker } from '../medDRA/meddraPicker';
import { createPregnancyAPICall, deletePregnancyAPICall, editPregnancyAPICall } from '../../redux/actions/demographicData';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({
    patientProfile: state.patientProfile,
    fields: state.availableFields
}))
export default class EditPregnancy extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            newStartDate: moment(),
            newEndDate: moment(),
            noEndDate: true,
            error: false,
            outcome: 'unselected',
            meddra: undefined
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
        this._handleOutcomeChange = this._handleOutcomeChange.bind(this);
    }


    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore, newDate: moment(), newName: '', error: false }));
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

    _handleOutcomeChange(ev) {
        this.setState({
            outcome: ev.target.value,
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
                error: 'Please select the outcome date'
            });
            return;
        }
        if (!this.state.noEndDate && (!this.state.outcome || this.state.outcome === 'unselected')) {
            this.setState({
                error: 'Please select an outcome'
            });
            return;
        }
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                patient: data.id,
                startDate: this.state.newStartDate ? this.state.newStartDate.toISOString() : undefined,
                outcomeDate: !this.state.noEndDate && this.state.newEndDate ? this.state.newEndDate.toISOString() : undefined,
                outcome: !this.state.noEndDate && this.state.outcome ? parseInt(this.state.outcome, 10) : undefined,
                meddra: this.state.meddra
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(createPregnancyAPICall(body));
            this.setState({ addMore: false });
        });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { pregnancyOutcomes, meddra_Hash } = fields;
        if (!patientProfile.fetching) {
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Pregnancies</h2>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        {patientProfile.data.pregnancy
                            .sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))
                            .map((el) =>
                                <OnePregnancy
                                    key={Math.random()}
                                    data={el}
                                    pregnancyOutcomes={pregnancyOutcomes}
                                    meddra_Hash={meddra_Hash}
                                    _handleClickDelete={this._handleClickDelete}
                                    patientId={patientProfile.data.patientId}
                                />
                            )}
                        {!this.state.addMore ?
                            <>
                                <br />
                                <button onClick={this._handleClickingAdd}>Add pregnancies</button>
                            </>
                            :
                            <>
                                <div className={style.newInterruption}>
                                    <label>Start date: </label><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br />
                                    <label htmlFor='noEndDate'>The pregnancy is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={this.state.noEndDate} /><br />
                                    {this.state.noEndDate ? null : (
                                        <>
                                            <label htmlFor='outcomeDate'>Outcome date: </label><PickDate startDate={!this.state.noEndDate ? this.state.newEndDate : null} handleChange={this._handleEndDateChange} /><br />
                                            <label>Outcome: </label>
                                            <select value={this.state.outcome} onChange={this._handleOutcomeChange}>
                                                <option value='unselected'></option>
                                                {pregnancyOutcomes.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                            </select><br /><br />
                                            <label>MedDRA: </label><MeddraPicker value={this.state.meddra} onChange={this._handleMeddraChange} /><br />
                                        </>
                                    )}
                                </div>
                                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                                <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                <button onClick={this._handleClickingAdd}>Cancel</button><br />
                            </>
                        }
                    </form>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}


class OnePregnancy extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            error: false,
            startDate: moment(parseInt(data.startDate)),
            noEndDate: data.outcomeDate ? false : true,
            outcomeDate: data.outcomeDate ? moment(parseInt(data.outcomeDate)) : moment(),
            outcome: data.outcome ? data.outcome : 'unselected',
            meddra: data.meddra,
            startDate_original: moment(parseInt(data.startDate)),
            outcomeDate_original: data.outcomeDate ? moment(parseInt(data.outcomeDate)) : null,
            outcome_original: data.outcome ? data.outcome : 'unselected',
            meddra_original: data.meddra,
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleOutcomeChange = this._handleOutcomeChange.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
    }

    _handleClickDelete = () => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this pregnancy record?', handler: this._deleteFunction(this.props.data.id) }));
    }

    _deleteFunction = id => {
        const that = this;
        return () => {
            const { patientId } = that.props;
            const body = {
                patientId: patientId,
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
        if (!this.state.startDate || !this.state.startDate.isValid()) {
            this.setState({
                error: 'Please select a start date'
            });
            return;
        }
        if (!this.state.noEndDate && (!this.state.outcomeDate || !this.state.outcomeDate.isValid())) {
            this.setState({
                error: 'Please select the outcome date'
            });
            return;
        }
        if (!this.state.noEndDate && (!this.state.outcome || this.state.outcome === 'unselected')) {
            this.setState({
                error: 'Please select an outcome'
            });
            return;
        }
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                id: parseInt(data.id, 10),
                startDate: this.state.startDate ? this.state.startDate.toISOString() : null,
                outcomeDate: !this.state.noEndDate && this.state.outcomeDate ? this.state.outcomeDate.toISOString() : null,
                outcome: !this.state.noEndDate && this.state.outcome ? parseInt(this.state.outcome, 10) : null,
                meddra: this.state.meddra
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyAPICall(body));
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
            outcomeDate: date,
            error: false
        });
    }

    _handleToggleNoEndDate = ev => {
        this.setState({
            noEndDate: ev.target.checked,
            error: false
        });
    }

    _handleOutcomeChange = ev => {
        this.setState({
            outcome: ev.target.value,
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
        const { editing, startDate, outcomeDate, noEndDate, outcome, meddra, startDate_original, outcomeDate_original, outcome_original, meddra_original } = this.state;
        const { data, pregnancyOutcomes, meddra_Hash } = this.props;
        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <div className={style.editInterruption}>
                                <label>Start date: </label><PickDate startDate={startDate} handleChange={this._handleStartDateChange} /><br />
                                <label htmlFor='noEndDate'>The pregnancy is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={noEndDate} /><br />
                                {noEndDate ? null : (
                                    <>
                                        <label htmlFor='outcomeDate'>Outcome date: </label><PickDate startDate={!noEndDate ? outcomeDate : null} handleChange={this._handleEndDateChange} /><br />
                                        <label>Outcome: </label>
                                        <select onChange={this._handleOutcomeChange} value={outcome}>
                                            <option value='unselected'></option>
                                            {pregnancyOutcomes.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                        </select><br /><br />
                                        <label>MedDRA: </label><MeddraPicker key={data.id} value={meddra} onChange={this._handleMeddraChange} /><br />
                                    </>
                                )}
                            </div>
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                            <label>Start date: </label> {startDate_original._d.toDateString()} <br />
                            {outcomeDate_original ? <><label>End date: </label> {outcomeDate_original._d.toDateString()}<br /></> : null}
                            {outcome_original !== 'unselected' ? <><label>Outcome: </label> {pregnancyOutcomes.filter(ele => ele.id === outcome_original)[0].value} <br /></> : null}
                            {meddra_original ? <><label>MedDRA: </label> {meddra_Hash[0][meddra_original].name} <br /></> : null}
                            <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}