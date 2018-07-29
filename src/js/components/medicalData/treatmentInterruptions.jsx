import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from './dataPage';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { SuggestionInput } from '../meDRA/meDRApicker';
import { createTreatmentInterruptionAPICall } from '../../redux/actions/treatments';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({ patientProfile: state.patientProfile, fields: state.availableFields, meddra: state.meddra }))
export class TreatmentInterruption extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            newStartDate: moment(),
            newEndDate: moment(),
            noEndDate: false,
            error: false
        };
        this.reasonRef = React.createRef();
        this.meddraRef = React.createRef();
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: '', error: false });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value, error: false });
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
        const meddraFields = this.props.meddra.result.filter(el => el.name === this.meddraRef.current.value);
        if (meddraFields.length === 0) {
            this.setState({ error: true });
            return;
        }
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                treatmentId: parseInt(this.props.match.params.elementId, 10),
                start_date: this.state.newStartDate._d.toDateString(),
                end_date: this.state.noEndDate ? null : this.state.newEndDate._d.toDateString(),
                reason: parseInt(this.reasonRef.current.value, 10),
                meddra: meddraFields[0].id
            }
        };
        store.dispatch(createTreatmentInterruptionAPICall(body));
        this.setState({ addMore: false });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { interruptionReasons, allMeddra } = fields;
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
                            {treatment.interruptions.map((el, ind) => (
                                <div key={`${el.endDate}${el.startDate}${el.reason}`} className={ind === treatment.interruptions.length - 1 ? style.interruptionLast : style.interruption}>
                                    <label>Start date: </label> {new Date(parseInt(el.startDate, 10)).toDateString()} <br />
                                    {el.endDate ? <span><label>End date: </label> {new Date(parseInt(el.endDate, 10)).toDateString()}<br /></span> : null}
                                    <label>Reason: </label> {interruptionReasons.filter(ele => ele.id === el.reason)[0].value} <br />
                                    <label>MedDRA: </label> {el.meddra ? allMeddra[0][el.meddra] : 'NA'}
                                </div>
                            ))}


                            {!this.state.addMore ?
                                <>
                                    <br />
                                    <button onClick={this._handleClickingAdd}>Add interruptions</button>
                                </>
                                :
                                <>
                                    <div className={style.newInterruption}>
                                        <label>Start date: </label><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /><br />
                                        <label>No end date: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} /><br /><br />
                                        {this.state.noEndDate ? null : (<><label>End date: </label><PickDate startDate={!this.state.noEndDate ? this.state.newEndDate : null} handleChange={this._handleEndDateChange} /><br /></>)}
                                        <label>Reason: </label>
                                        <select ref={this.reasonRef}>
                                            {interruptionReasons.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                        </select><br /><br />
                                        <b>MedDRA: </b><SuggestionInput reference={this.meddraRef} /><br />
                                    </div>
                                    <br />
                                    <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                    <button onClick={this._handleClickingAdd}>Cancel</button><br />
                                    {this.state.error ? <><br /><div className={style.error}> Your medDRA code is not a permitted value.</div></> : null}
                                </>}
                        </form>
                    </>
                );
            } else {
                return <div> Cannot find your treatment! Please check the id in your url. </div>;
            }
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}