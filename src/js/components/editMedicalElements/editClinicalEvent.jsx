import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteCEAPICall, updateCECall } from '../../redux/actions/clinicalEvents';
import { SuggestionInput } from '../meDRA/meDRApicker';

@connect(state => ({ CEs: state.patientProfile.data.clinicalEvents }))
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
        store.dispatch(addAlert({ alert: 'about deleting this event?', handler: this._deleteFunction }));
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
        if (CEsFiltered.length !== 1) {
            return <div> Cannot find your treatment! check your ID! </div>;
        }
        const CE = CEsFiltered[0];
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit Clinical Event</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <h3>Please select the following options: </h3>
                    <br />
                    {wannaUpdate ? <UpdateCEEntry data={CE} /> : null}
                    {wannaUpdate ? <><br /><br /> <button onClick={this._handleWannaUpdateClick}>Cancel</button></> :
                        <button onClick={this._handleWannaUpdateClick}>Change start date / MedDRA</button>
                    }
                    <br /><br /><br /><br />
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this event</button>
                    <br /><br />
                    Note: event type is not allowed to be changed. If you entered an event of the wrong type by error, you can delete the event and create a new one.
                </form>
            </>
        );
    }
}


@connect(state => ({ patientId: state.patientProfile.data.patientId, meddraDict: state.availableFields.allMeddra_ReverseHash[0], meddraHash: state.availableFields.allMeddra[0] }))
class UpdateCEEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            id: props.data.id,
            startDate: moment(parseInt(props.data.dateStartDate)),
            endDate: props.data.endDate ? moment(parseInt(props.data.endDate)) : moment(),
            addEndDate: true,
            meddra: React.createRef(),
            meddraOriginal: props.data.meddra
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            id: props.data.id,
            startDate: moment(parseInt(props.data.dateStartDate)),
            meddra: React.createRef(),
            meddraOriginal: props.data.meddra
        };
    }

    _handleChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }


    _handleToggleEndDate(ev) {
        ev.preventDefault();
        this.setState(prevState => ({ addEndDate: !prevState.addEndDate }));
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
        const { patientId, meddraDict } = this.props;
        const { id, startDate, meddra, addEndDate, endDate } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                dateStartDate: startDate.valueOf(),
                meddra: meddraDict[meddra.current.value],
                endDate: addEndDate ? endDate.valueOf() : null
            }
        };
        store.dispatch(updateCECall(body));
    }

    render() {
        const { startDate, meddra, meddraOriginal } = this.state;
        const { meddraHash } = this.props;
        return (
            <>
                <label>Start Date: </label>
                <PickDate startDate={startDate} handleChange={this._handleDateChange} />

                { this.state.addEndDate ?
                    <>
                    <label htmlFor=''>Please enter date on which the event ended:</label><br /><PickDate startDate={this.state.endDate} handleChange={this._handleEndDateChange} />
                    <span className={style.noEndDateButton} onClick={this._handleToggleEndDate}>Click here if there is no end date (you can add it later)</span></>
                    :
                    <button onClick={this._handleToggleEndDate}>Add end date</button>
                }
                <br/><br/>
                <label>MedDRA: </label>
                <SuggestionInput originalValue={meddraHash[meddraOriginal]} reference={meddra} /><br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}