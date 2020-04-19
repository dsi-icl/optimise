import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { createConcomitantMedAPICall, deleteConcomitantMedAPICall, editConcomitantMedAPICall } from '../../redux/actions/concomitantMed';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    patientProfile: state.patientProfile,
    types: state.availableFields.concomitantMedsList
}))
export default class EditConcomitantMeds extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
    }

    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore, error: false }));
    }

    render() {
        const { patientProfile, match, location, renderedInFrontPage } = this.props;

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        if (!patientProfile.fetching) {
            return (
                <>
                    <div className={_style.ariane}>
                        <h2>Concomitant Medication</h2>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                    </div>
                    <form className={_style.panel}>
                        {patientProfile.data.concomitantMeds
                            /* if rendered in front page then show all visits; if not then, only the visit in the page */
                            .filter((el) => renderedInFrontPage ? true : parseInt(el.visit) === parseInt(this.props.match.params.visitId))
                            .map((el) =>
                                <OneComorbidity
                                    key={el.id}
                                    data={el}
                                    _handleClickDelete={this._handleClickDelete}
                                    patientId={patientProfile.data.patientId}
                                />
                            )}
                        {!this.state.addMore ?
                            <>
                                <br />
                                <button onClick={this._handleClickingAdd}>Record more concomitant medication</button>
                            </>
                            :
                            <>
                                <div className={_style.newInterruption}>
                                    <label>Record new concomitant medication: </label><CreateConcomitantMed match={match} location={location} value={this.state.comorbidity} onChange={this._handleValueChange} />
                                </div>
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

@connect(state => ({
    typedict: state.availableFields.concomitantMedsList_hash[0],
    types: state.availableFields.concomitantMedsList,
    patientId: state.patientProfile.data.patientId
}))
class OneComorbidity extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            error: false,
            noEndDate_new: data.endDate === null || data.endDate === undefined,
            endDate_new: data.endDate ? moment(parseInt(data.endDate)) : moment(),
            startDate_new: moment(parseInt(data.startDate)),
            indication_new: data.indication,
            type_new: data.concomitantMedId
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleCancelClick = this._handleCancelClick.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
        this._handleIndicationChange = this._handleIndicationChange.bind(this);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate_new: ev.target.checked,
            error: undefined
        });
    }

    _handleIndicationChange(e) {
        this.setState({
            indication_new: e.target.value,
            error: undefined
        });
    }

    _handleStartDateChange(date) {
        this.setState({
            startDate_new: date,
            error: undefined
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            endDate_new: date,
            error: undefined
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            type_new: ev.target.value,
            error: undefined
        });
    }

    _handleClickDelete = () => {
        store.dispatch(
            addAlert({
                alert: 'Do you want to delete this concomitant medication record?',
                handler: this._deleteFunction(this.props.data.id)
            })
        );
    }

    _handleCancelClick = (ev) => {
        ev.preventDefault();
        const { data } = this.props;
        this.setState({
            editing: false,
            noEndDate_new: data.noEndDate,
            endDate_new: data.endDate ? moment(parseInt(data.endDate)) : moment(),
            startDate_new: moment(parseInt(data.startDate)),
            indication_new: data.indication,
            type_new: data.type,
            error: false
        });
    }

    _deleteFunction = id => {
        const that = this;
        return () => {
            const { patientId } = that.props;
            const body = {
                patientId: patientId,
                data: {
                    concomitantMedEntryId: id
                }
            };
            store.dispatch(deleteConcomitantMedAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.startDate_new
            || !this.state.indication_new
            || !this.state.type_new === 'unselected'
            || (!this.state.noEndDate_new && !this.state.endDate_new)
        ) {
            this.setState({
                error: 'Missing data.'
            });
            return;
        }
        const body = {
            patientId: this.props.patientId,
            data: {
                concomitantMedEntryId: this.props.data.id,
                concomitantMedId: parseInt(this.state.type_new),
                indication: this.state.indication_new,
                startDate: this.state.startDate_new.valueOf(),
                endDate: this.state.noEndDate_new ? null : this.state.endDate_new.valueOf()
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false,
            editing: false
        }, () => {
            store.dispatch(editConcomitantMedAPICall(body));
            // this.setState({ addMore: false });
        });
    }

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing,
            error: false
        }));
    }

    render() {
        const { editing } = this.state;
        const { data, typedict } = this.props;
        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <label htmlFor='event'>What medication is it?</label><br />
                            <select name='event' value={this.state.type_new} onChange={this._handleTypeChange} autoComplete='off'>
                                <>{this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</>
                            </select> <br /><br />
                            <label>Indication: <input type='text' value={this.state.indication_new} onChange={this._handleIndicationChange}/></label> <br/><br/>
                            <label htmlFor=''>Start date:</label><br /><PickDate startDate={this.state.startDate_new} handleChange={this._handleStartDateChange} /><br /><br/>
                            <label htmlFor='noEndDate'>The medication is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate_new} /><br />
                            {this.state.noEndDate_new ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.endDate_new ? this.state.endDate_new : moment()} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleCancelClick}>Cancel</button>
                        </>
                        :
                        <>
                            <p><b>Drug:</b> {typedict[data.concomitantMedId].name}</p>
                            <p><b>Indication:</b> {data.indication}</p>
                            <p><b>Start date:</b> {new Date(parseInt(data.startDate, 10)).toDateString()}</p>
                            { data.endDate ? <p><b>End date:</b> {new Date(parseInt(data.endDate, 10)).toDateString()}</p> : <p>Patient is still taking this medication</p> }
                            <br/>
                            <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}


@connect(state => ({
    patientId: state.patientProfile.data.id,
    patientProfile: state.patientProfile,
    types: state.availableFields.concomitantMedsList
}))
class CreateConcomitantMed extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            noEndDate: true,
            endDate: moment(),
            startDate: moment(),
            indication: '',
            type: 'unselected',
        };
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
        this._handleIndicationChange = this._handleIndicationChange.bind(this);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked,
            error: undefined
        });
    }

    _handleIndicationChange(e) {
        this.setState({
            indication: e.target.value,
            error: undefined
        });
    }

    _handleStartDateChange(date) {
        this.setState({
            startDate: date,
            error: undefined
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            endDate: date,
            error: undefined
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            type: ev.target.value,
            error: undefined
        });
    }


    _handleSubmitClick(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.startDate
            || !this.state.indication
            || !this.state.type === 'unselected'
            || (!this.state.noEndDate && !this.state.endDate)
        ) {
            this.setState({
                error: 'Missing data.'
            });
            return;
        }
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                visitId: parseInt(this.props.match.params.visitId),
                concomitantMedId: parseInt(this.state.type),
                indication: this.state.indication,
                startDate: this.state.startDate.valueOf(),
                endDate: this.state.noEndDate ? null : this.state.endDate.valueOf()
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(createConcomitantMedAPICall(body));
            // this.setState({ addMore: false });
        });
    }

    render() {
        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }
        return (
            <div className={_style.panel}>
                <label htmlFor='event'>What medication is it?</label><br />
                <select name='event' value={this.state.type} onChange={this._handleTypeChange} autoComplete='off'>
                    <option value='unselected'></option>
                    <>{this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</>
                </select> <br /><br />
                <label>Indication: <input type='text' value={this.state.indication} onChange={this._handleIndicationChange}/></label> <br/><br/>
                <label htmlFor=''>Start date:</label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleStartDateChange} /><br /><br/>
                <label htmlFor='noEndDate'>The medication is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                {this.state.noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.endDate ? this.state.endDate : moment()} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmitClick}>Submit</button>
            </div>
        );
    }
}

