import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BackButton } from './dataPage.jsx';
import { PickDate } from '../createMedicalElements/datepicker.jsx';
import { formatRow } from '../patientProfile/patientChart.jsx';
import cssButtons from '../../../css/buttons.module.css';
import cssIcons from '../../../css/icons.module.css';
import store from '../../redux/store.js';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import moment from 'moment';

@connect(state => ({ patientProfile: state.patientProfile, fields: state.availableFields }))
export class TreatmentInterruption extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            newStartDate: moment(),
            newEndDate: moment(),
            noEndDate: false,
            newReason: null,
            newMeddra: null
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleToggleNoEndDate = this._handleToggleNoEndDate.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: '' });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value });
    }


    _handleStartDateChange(date) {
        this.setState({
            newStartDate: date
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            newEndDate: date
        });
    }

    _handleToggleNoEndDate(ev) {
        this.setState({ noEndDate: ev.target.checked });
    }

    _handleSubmit() {
        const data = this.props.data;
        const body = { patientId: data.patientId, data: { patient: data.id, vaccineName: this.state.newName, immunisationDate: this.state.newDate._d.toDateString() } };

    }

    render() {
        const { patientProfile, fields } = this.props;
        const inputStyle = { width: '100%', margin: 0 };
        if (!patientProfile.fetching) {
            const { params } = this.props.match;
            const treatmentsFiltered = patientProfile.data.treatments.filter(el => el.id === parseInt(params.elementId, 10));
            if (treatmentsFiltered.length !== 0) {
                const treatment = treatmentsFiltered[0];
                return (
                    <div>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                        <h2>TREATMENT INTERRUPTIONS</h2>
                        <table style={{ width: '100%' }}>
                            {this.state.addMore || treatment.interruptions.length !== 0 ? <thead>
                                <tr><th>Start date</th><th>End date</th><th>No end date</th><th>Reason</th><th>MedDRA</th></tr>
                            </thead> : null}
                            <tbody>
                                {treatment.interruptions.map(el => formatRow([
                                    new Date(parseInt(el.startDate, 10)).toDateString(),
                                    el.endDate ? new Date(parseInt(el.endDate, 10)).toDateString() : 'NA',
                                    el.endDate ? 'False' : 'True',

                                ]))}
                                {!this.state.addMore ? null : <tr>
                                    <td><PickDate startDate={this.state.newStartDate} handleChange={this._handleStartDateChange} /></td>
                                    <td>
                                        <PickDate startDate={!this.state.noEndDate ? this.state.newEndDate : null} handleChange={this._handleEndDateChange} />
                                    </td>
                                    <td>
                                        <input type='checkbox' name='noEndDate' onChange={this._handleToggleNoEndDate} />
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>}
                            </tbody>
                        </table>
                        {!this.state.addMore ? <div className={cssButtons.createPatientButton} onClick={this._handleClickingAdd}>Add interruptions</div> :
                            <div>
                                <div className={cssButtons.createPatientButton} onClick={this._handleSubmit}>Submit</div>
                                <div onClick={this._handleClickingAdd} className={cssButtons.createPatientButton}>Cancel</div>
                            </div>}
                    </div>
                );
            } else {
                return <div> Cannot find your treatment! Please check the id in your url. </div>
            }
        } else {
            return <div className={cssIcons.spinner}><LoadingIcon /></div>;
        }
    }
}