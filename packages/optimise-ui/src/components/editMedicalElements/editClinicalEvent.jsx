import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/utils';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { MeddraPicker } from '../medDRA/meddraPicker';
import { addAlert } from '../../redux/actions/alert';
import { deleteCEAPICall, updateCECall } from '../../redux/actions/clinicalEvents';


@connect(state => ({
    CEs: state.patientProfile.data.clinicalEvents
}))
export default class EditCE extends Component {
    constructor(props) {
        super(props);
        this.state = { wannaUpdate: false, elementId: props.match.params.elementId };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.elementId === state.elementId)
            return state;
        return {
            ...state,
            wannaUpdate: false,
            elementId: props.match.params.elementId
        };
    }

    _handleWannaUpdateClick(ev) {
        ev.preventDefault();
        this.setState(oldState => ({ wannaUpdate: !oldState.wannaUpdate }));
    }

    _handleClick(ev) {
        ev.preventDefault();
        store.dispatch(addAlert({ alert: 'Are you sure you want to delete this clinical event record?', handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const { params } = this.props.match;
        const body = { patientId: params.patientId, data: { ceId: parseInt(params.elementId) }, to: `/patientProfile/${params.patientId}` };
        store.dispatch(deleteCEAPICall(body));
    }

    render() {
        const { params } = this.props.match;
        const { CEs } = this.props;
        const { wannaUpdate } = this.state;
        if (!CEs) {
            return <div></div>;
        }
        const CEsFiltered = CEs.filter(el => el.id === parseInt(params.elementId));
        const CE = CEsFiltered ? CEsFiltered[0] : null;

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        return (
            <>
                <div className={_style.ariane}>
                    <h2>Edit Clinical Event</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={_style.panel}>
                    {CE ?
                        <>
                            {wannaUpdate ? <UpdateCEEntry data={CE} elementId={params.elementId} /> : null}
                            {wannaUpdate ? <><button onClick={this._handleWannaUpdateClick}>Cancel</button><br /><br /></> :
                                <><button onClick={this._handleWannaUpdateClick}>Change start date / MedDRA</button><br /><br /></>
                            }
                            <button onClick={this._handleClick} className={style.deleteButton}>Delete this event</button>
                            <br /><br />
                            <div>
                                Note: You cannot change the type of clinical event. If you created the wrong type of clinical event you can delete this event record and create a new one.
                            </div>
                        </>
                        :
                        <div>
                            <i>We could not find the clinical event you are looking for.</i>
                        </div>
                    }
                </form>
            </>
        );
    }
}


@connect(state => ({
    patientId: state.patientProfile.data.patientId
}))
class UpdateCEEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            id: props.data.id,
            elementId: props.elementId,
            startDate: moment(parseInt(props.data.dateStartDate)),
            endDate: props.data.endDate ? moment(parseInt(props.data.endDate)) : moment(),
            noEndDate: !props.data.endDate,
            meddra: props.data.meddra
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
        this._handleMeddraChange = this._handleMeddraChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.elementId === state.elementId)
            return state;
        return {
            ...state,
            id: props.data.id,
            elementId: props.elementId,
            startDate: moment(parseInt(props.data.dateStartDate)),
            meddra: props.data.meddra
        };
    }

    _handleMeddraChange(value) {
        this.setState({ meddra: value });
    }

    _handleChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            endDate: date
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        const { patientId } = this.props;
        const { id, startDate, meddra, noEndDate, endDate } = this.state;

        if (!startDate || !startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the start date of the event'
            });
        }
        if (!noEndDate && (!endDate || !endDate.isValid())) {
            return this.setState({
                error: 'Please indicate the resolution date of the event'
            });
        }
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}/edit/clinicalEvent/${id}`,
            data: {
                id,
                dateStartDate: startDate.toISOString() || null,
                meddra,
                endDate: !noEndDate && endDate ? endDate.toISOString() : null
            }
        };

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(updateCECall(body));
        });
    }

    render() {
        const { startDate, meddra, id } = this.state;
        return (
            <div className={style.panelWrapper}>
                <label>Start Date: </label>
                <PickDate startDate={startDate} handleChange={this._handleDateChange} /><br />
                <label htmlFor='noEndDate'>The event is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                {this.state.noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.endDate ? this.state.endDate : moment()} handleChange={this._handleEndDateChange} /><br /><br /></>)}
                <label>MedDRA: </label>
                <MeddraPicker key={id} value={meddra === null || meddra === undefined ? undefined : String(meddra)} onChange={this._handleMeddraChange} /><br /><br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmit}>Submit</button><br /><br />
            </div>
        );
    }
}