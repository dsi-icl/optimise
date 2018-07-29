import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/dataPage';
import { SuggestionInput } from '../meDRA/meDRApicker';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteTreatmentCall, updateTreatmentCall } from '../../redux/actions/treatments';
import style from './editMedicalElements.module.css';

@connect(state => ({ treatments: state.patientProfile.data.treatments }))
export default class EditMed extends Component {
    constructor() {
        super();
        this.state = { wannaUpdate: false };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
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
        store.dispatch(addAlert({ alert: 'about deleting this test?', handler: this._deleteFunction }));
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }


    _deleteFunction() {
        const { params } = this.props.match;
        const body = { patientId: params.patientId, data: { treatmentId: parseInt(params.elementId) }, to: `/patientProfile/${params.patientId}` };
        store.dispatch(deleteTreatmentCall(body));
    }

    render() {
        const { params } = this.props.match;
        const { treatments } = this.props;
        const { wannaUpdate } = this.state;
        if (!treatments) {
            return <div></div>;
        }
        const treatmentsFiltered = treatments.filter(el => el.id === parseInt(params.elementId));
        if (treatmentsFiltered.length !== 1) {
            return <div> Cannot find your treatment! check your ID! </div>;
        }
        const treatment = treatmentsFiltered[0];
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit Medication</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    {wannaUpdate ? <UpdateMedEntry data={treatment} /> : null}
                    {wannaUpdate ? <><button onClick={this._handleWannaUpdateClick}>Cancel</button><br /><br /></> :
                        <><button onClick={this._handleWannaUpdateClick}>Change drug, dose, form or frequency</button> <br /> <br /></>
                    }
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this medication</button>
                    <br /><br />
                </form>
            </>
        );
    }
}


@connect(state => ({ drugs: state.availableFields.drugs, interruptionReasons: state.availableFields.interruptionReasons, patientId: state.patientProfile.data.patientId, meddraDict: state.availableFields.allMeddra_ReverseHash[0], meddraHash: state.availableFields.allMeddra[0] }))
class UpdateMedEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            id: props.data.id,
            drug: props.data.drug,
            dose: props.data.dose,
            unit: props.data.unit,
            noEndDate: !props.data.terminatedDate,
            startDate: moment(parseInt(props.data.startDate)),
            terminatedDate: props.data.terminatedDate ? moment(parseInt(props.data.terminatedDate)) : undefined,
            terminatedReason: props.data.terminatedReason ? props.data.terminatedReason : undefined,
            form: props.data.form,
            times: props.data.times ? props.data.times : undefined,
            intervalUnit: props.data.intervalUnit || '',
            meddra: React.createRef()
        };
        this.reasonRef = React.createRef();
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
        this._handleTerminatedDateChange = this._handleTerminatedDateChange.bind(this);
    }

    _handleToggleNoEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked
        });
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

    _handleTerminatedDateChange(date) {
        this.setState({
            terminatedDate: date
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { patientId } = this.props;
        const { id, drug, dose, unit, form, times, intervalUnit } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                drug: parseInt(drug),
                dose: parseInt(dose),
                unit,
                form,
                times: isNaN(parseInt(times)) || intervalUnit === '' ? undefined : parseInt(times),
                startDate: this.state.startDate.valueOf(),
                terminatedDate: this.state.terminatedDate && !this.state.noEndDate ? this.state.terminatedDate.valueOf() : null,
                // terminatedReason: parseInt(this.reasonRef.current.value, 10),
                intervalUnit: intervalUnit === '' || isNaN(parseInt(times)) ? undefined : intervalUnit,
                // meddra: this.props.meddraDict[this.state.meddra.current.value]
            }
        };
        store.dispatch(updateTreatmentCall(body));
    }

    render() {
        const { drug, dose, unit, form, times } = this.state;
        const { drugs } = this.props;
        return (
            <>
                <label>Drug: </label>
                <select onChange={this._handleChange} name='drug' value={drug}>
                    {drugs.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                </select><br /><br />
                <label>Dose: </label>
                <input onChange={this._handleChange} name='dose' value={dose} /><br /><br />
                <label>Unit: </label>
                <select onChange={this._handleChange} name='unit' value={unit}>
                    <option value=''></option>
                    <option value='cc'>cc</option>
                    <option value='mg'>mg</option>
                </select><br /><br />
                <label>Form: </label>
                <select onChange={this._handleChange} name='form' value={form}>
                    <option value=''></option>
                    <option value='OR'>Oral</option>
                    <option value='IV'>Intravenous</option>
                    <option value='IM'>Intramuscular</option>
                    <option value='SC'>Subcutaneous</option>
                </select><br /><br />
                <label htmlFor='startDate'>Start date: </label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br /><br />
                <label>Frequency (fill both or leave both blank): </label>
                <input onChange={this._handleChange} name='times' value={times} /><br /><br />
                <select name='intervalUnit' value={this.state.intervalUnit} onChange={this._handleChange} autoComplete='off'>
                    <option value=''></option>
                    <option value='hour'>hour</option>
                    <option value='day'>day</option>
                    <option value='week'>week</option>
                    <option value='month'>month</option>
                    <option value='year'>year</option>
                </select><br /><br />
                <label htmlFor='noEndDate'>No end date: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={this.state.noEndDate} /><br /><br />
                {this.state.noEndDate ? null : (<><label htmlFor='terminatedDate'>End date: </label><PickDate startDate={this.state.terminatedDate ? this.state.terminatedDate : moment()} handleChange={this._handleTerminatedDateChange} /><br /></>)}
                {/* <label htmlFor='terminatedReason'>Reason: </label>
                <select name='terminatedReason' ref={this.reasonRef}>
                    {this.props.interruptionReasons.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                </select><br /><br /> */}
                {/* <label htmlFor='meddra'>MedDRA: </label><br /><SuggestionInput originalValue={this.props.meddraHash[this.state.terminatedReason]} reference={this.state.meddra} /><br /> */}
                <button onClick={this._handleSubmit}>Submit</button><br /><br />
            </>
        );
    }
}