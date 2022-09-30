import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { BackButton } from '../medicalData/utils';
import { PickDate } from '../createMedicalElements/datepicker';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteTreatmentCall, updateTreatmentCall } from '../../redux/actions/treatments';
import style from './editMedicalElements.module.css';

@connect(state => ({
    treatments: state.patientProfile.data.treatments
    }))
class EditMed extends Component {
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
        store.dispatch(addAlert({ alert: 'Are you sure you want to delete this medication record?', handler: this._deleteFunction }));
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }


    _deleteFunction() {
        const { params } = this.props.match;
        const { renderedInFrontPage } = this.props;
        const body = { patientId: params.patientId, data: { treatmentId: parseInt(params.elementId) }, to: renderedInFrontPage ? `/patientProfile/${params.patientId}/visitFrontPage/${params.visitId}/page/${params.currentPage}${this.props.location.search}` : `/patientProfile/${params.patientId}` };
        store.dispatch(deleteTreatmentCall(body));
    }

    render() {
        const { params } = this.props.match;
        const { treatments, renderedInFrontPage } = this.props;
        const { wannaUpdate } = this.state;
        if (!treatments) {
            return <div></div>;
        }
        const treatmentsFiltered = treatments.filter(el => el.id === parseInt(params.elementId));
        const treatment = treatmentsFiltered ? treatmentsFiltered[0] : null;

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }
        return (
            <>
                <div className={_style.ariane}>
                    <h2>Edit Treatment</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={_style.panel}>
                    {treatment ?
                        <>
                            {wannaUpdate ? <UpdateMedEntry location={this.props.location} renderedInFrontPage={this.props.renderedInFrontPage} data={treatment} /> : null}
                            {wannaUpdate ? <><button onClick={this._handleWannaUpdateClick}>Cancel</button><br /><br /></> :
                                <><button onClick={this._handleWannaUpdateClick}>Change treatment, dose, form or frequency</button> <br /> <br /></>
                            }
                            <button onClick={this._handleClick} className={style.deleteButton}>Delete this treatment</button>
                            {
                                renderedInFrontPage ?
                                    <>
                                        <br/><br/><br/>
                                        <NavLink to={`/patientProfile/${params.patientId}/visitFrontPage/${params.visitId}/page/${params.currentPage}${this.props.location.search}`}><button>Back</button></NavLink>
                                    </>
                                    :
                                    null
                            }
                        </>
                        :
                        <div>
                            <i>We could not find the treatment you are looking for.</i>
                        </div>
                    }
                </form>
            </>
        );
    }
}

export default EditMed;

@connect(state => ({
    drugs: state.availableFields.drugs,
    interruptionReasons: state.availableFields.interruptionReasons,
    patientId: state.patientProfile.data.patientId
    }))
class UpdateMedEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            id: props.data.id,
            drug: props.data.drug ? props.data.drug : '',
            dose: props.data.dose ? props.data.dose : '',
            unit: props.data.unit ? props.data.unit : '',
            noEndDate: !props.data.terminatedDate,
            startDate: moment(parseInt(props.data.startDate)),
            terminatedDate: props.data.terminatedDate ? moment(parseInt(props.data.terminatedDate)) : undefined,
            terminatedReason: props.data.terminatedReason ? props.data.terminatedReason : 'unselected',
            form: props.data.form ? props.data.form : 'unselected',
            times: props.data.times ? props.data.times : undefined,
            intervalUnit: props.data.intervalUnit || ''
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
            noEndDate: ev.target.checked,
            error: false
        });
    }

    _handleChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        newState.error = false;
        this.setState(newState);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: false
        });
    }

    _handleTerminatedDateChange(date) {
        this.setState({
            terminatedDate: date,
            error: false
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the start date of the treatment'
            });
        }
        if (!this.state.noEndDate && (!this.state.terminatedDate || !this.state.terminatedDate.isValid() || this.state.terminatedReason === 'unselected')) {
            return this.setState({
                error: 'Please indicate the termination date and reason of the treatment'
            });
        }
        if (this.state.drug === 'unselected') {
            return this.setState({
                error: 'Please indicate the treatment'
            });
        }

        const { patientId } = this.props;
        const { id, drug, dose, unit, form, times, intervalUnit } = this.state;
        const body = {
            patientId: patientId,
            to: this.props.renderedInFrontPage ? `${this.props.location.pathname}${this.props.location.search}` : `/patientProfile/${patientId}/edit/treatment/${id}`,
            data: {
                id,
                drug: parseInt(drug),
                dose: this.state.unit !== 'na' ? parseInt(dose) : null,
                unit,
                form,
                times: isNaN(parseInt(times)) || intervalUnit === '' ? undefined : parseInt(times),
                startDate: this.state.startDate.toISOString(),
                terminatedDate: this.state.terminatedDate && !this.state.noEndDate ? this.state.terminatedDate.toISOString() : undefined,
                terminatedReason: this.state.terminatedReason && !this.state.noEndDate ? this.state.terminatedReason : undefined,
                intervalUnit: intervalUnit === '' || isNaN(parseInt(times)) ? undefined : intervalUnit
                // meddra: this.props.meddraDict[this.state.meddra.current.value]
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(updateTreatmentCall(body));
        });
    }

    render() {
        const { drug, dose, unit, form, times } = this.state;
        const { drugs } = this.props;
        return (
            <>
                <label>Treatment: </label>
                <select onChange={this._handleChange} name='drug' value={drug}>
                    <option value='unselected'></option>
                    {drugs.filter(d => d.deleted === '-').sort((a, b) => a.name.localeCompare(b.name)).map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                </select><br /><br />
                <label>Dose: </label>
                <input disabled={unit === 'na'} onChange={this._handleChange} name='dose' value={unit === 'na' ? 'N/A' : dose} /><br /><br />
                <label>Unit: </label>
                <select onChange={this._handleChange} name='unit' value={unit}>
                    <option value='unselected'></option>
                    <option value='cc'>cc</option>
                    <option value='mg'>mg</option>
                    <option value='µg'>µg</option>
                    <option value='na'>N/A</option>
                </select><br /><br />
                <label>Form: </label>
                <select onChange={this._handleChange} name='form' value={form}>
                    <option value='unselected'></option>
                    <option value='OR'>Oral</option>
                    <option value='IV'>Intravenous</option>
                    <option value='IM'>Intramuscular</option>
                    <option value='IT'>Intrathecal</option>
                    <option value='SC'>Subcutaneous</option>
                    <option value='SL'>Sublingual</option>
                </select><br /><br />
                <label htmlFor='startDate'>Start date: </label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br /><br />
                <label>Frequency (fill both or leave both blank): </label>
                <select name='times' value={times} onChange={this._handleChange} autoComplete='off'>
                    <option value='unselected'></option>
                    <option value='1'>once</option>
                    <option value='2'>twice</option>
                    <option value='3'>three times</option>
                    <option value='4'>four times</option>
                </select><br /><br />
                <select name='intervalUnit' value={this.state.intervalUnit} onChange={this._handleChange} autoComplete='off'>
                    <option value='unselected'></option>
                    <option value='day'>per day</option>
                    <option value='week'>per week</option>
                    <option value='6weeks'>per six weeks</option>
                    <option value='8weeks'>per eight weeks</option>
                    <option value='month'>per month</option>
                    <option value='year'>per year</option>
                </select><br /><br />
                <label htmlFor='noEndDate'>The treatment is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} checked={this.state.noEndDate} /><br />
                {this.state.noEndDate ? null :
                    (<><label htmlFor='terminatedDate'>End date: </label>
                        <PickDate startDate={this.state.terminatedDate ? this.state.terminatedDate : moment()} handleChange={this._handleTerminatedDateChange} /><br /><br />
                        <label>Reason for termination:
                            <select name='terminatedReason' value={this.state.terminatedReason} onChange={this._handleChange}>
                                <option value='unselected'></option>
                                {this.props.interruptionReasons.map(el => <option value={el.id}>{el.value}</option>)}
                            </select>
                        </label>
                    </>)}
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmit}>Submit</button><br /><br />
            </>
        );
    }
}
