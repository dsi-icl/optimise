import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteTreatmentCall, updateTreatmentCall } from '../../redux/actions/treatments';

@connect(state => ({ treatments: state.patientProfile.data.treatments }))
export default class EditMed extends Component {
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
        store.dispatch(addAlert({ alert: 'about deleting this test?', handler: this._deleteFunction }));
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
                    <h3>Please select the following options: </h3>
                    <br />
                    {wannaUpdate ? <UpdateMedEntry data={treatment} /> : null}
                    {wannaUpdate ? <><br /><br /> <button onClick={this._handleWannaUpdateClick}>Cancel</button></> :
                        <button onClick={this._handleWannaUpdateClick}>Change drug, dose, form or frequency</button>
                    }
                    <br /><br /><br /><br />
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this medication</button>
                    <br /><br />
                </form>
            </>
        );
    }
}


@connect(state => ({ drugs: state.availableFields.drugs, patientId: state.patientProfile.data.patientId }))
class UpdateMedEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            id: props.data.id,
            drug: props.data.drug,
            dose: props.data.dose,
            unit: props.data.unit,
            form: props.data.form,
            timesPerDay: props.data.timesPerDay,
            durationWeeks: props.data.durationWeeks
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { patientId } = this.props;
        const { id, drug, dose, unit, form, timesPerDay, durationWeeks } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                drug: parseInt(drug),
                dose: parseInt(dose),
                unit,
                form,
                timesPerDay: parseInt(timesPerDay),
                durationWeeks: parseInt(durationWeeks)
            }
        };
        store.dispatch(updateTreatmentCall(body));
    }

    render() {
        const { drug, dose, unit, form, timesPerDay, durationWeeks } = this.state;
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
                    <option value='cc'>cc</option>
                    <option value='mg'>mg</option>
                </select><br /><br />
                <label>Form: </label>
                <select onChange={this._handleChange} name='form' value={form}>
                    <option value='IV'>IV</option>
                    <option value='oral'>oral</option>
                </select><br /><br />
                <label>Times per day: </label>
                <input onChange={this._handleChange} name='timesPerDay' value={timesPerDay} /><br /><br />
                <label>Duration in weeks: </label>
                <input onChange={this._handleChange} name='durationWeeks' value={durationWeeks} /><br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}