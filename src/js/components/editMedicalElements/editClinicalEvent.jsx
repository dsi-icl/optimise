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
    constructor() {
        super();
        this.state = { wannaUpdate: false };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
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
            meddra: React.createRef(),
            meddraOriginal: props.data.meddra
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { patientId, meddraDict } = this.props;
        const { id, startDate, meddra } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                dateStartDate: startDate.valueOf(),
                meddra: meddraDict[meddra.current.value]
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
                <label>MedDRA: </label>
                <SuggestionInput originalValue={meddraHash[meddraOriginal]} reference={meddra} /><br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}