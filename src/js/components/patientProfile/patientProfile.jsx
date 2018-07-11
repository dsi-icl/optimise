import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cssButtons from '../../../css/buttons.css';
import { PickDate } from '../createMedicalElements/datepicker.jsx';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';
import moment from 'moment';

@connect(state => ({ fetching: state.patientProfile.fetching }))
export class Section extends Component {
    render() {
        if (this.props.fetching) {
            return <span></span>;
        } else {
            return (<div style={{ position: 'relative' }}>
                <DemographicSection/>
                <ImmunisationSection/>
            </div>)
        }
    }
}

@connect(state => ({ demographicData: state.patientProfile.data.demographicData ? state.patientProfile.data.demographicData : false, fields: state.availableFields.demoFields[0] }))
class DemographicSection extends Component {
    render() {
        const { demographicData, fields } = this.props;
        if (demographicData) {
            let { DOB, alcoholUsage, countryOfOrigin, dominantHand, ethnicity, gender, smokingHistory } = demographicData;
            alcoholUsage = fields['alcohol_usage'].filter(el => el.id === alcoholUsage)[0].value;
            countryOfOrigin = fields['countries'].filter(el => el.id === countryOfOrigin)[0].country;
            dominantHand = fields['dominant_hands'].filter(el => el.id === dominantHand)[0].value;
            ethnicity = fields['ethnicities'].filter(el => el.id === ethnicity)[0].value;
            gender = fields['genders'].filter(el => el.id === gender)[0].value;
            smokingHistory = fields['smoking_history'].filter(el => el.id === smokingHistory)[0].value;

            return (
                <PatientProfileSectionScaffold sectionName='Profile'>
                    <span><b>Date of birth:</b> {DOB}</span><br/>
                    <span><b>Gender:</b> {gender} </span><br/>
                    <span><b>Dominant hand:</b> {dominantHand} </span><br/>
                    <span><b>Ethnicity:</b> {ethnicity} </span><br/>
                    <span><b>Country of origin:</b> {countryOfOrigin} </span><br/>
                    <span><b>Alcohol usage:</b> {alcoholUsage} </span><br/>
                    <span><b>Smoking history:</b> {smokingHistory} </span><br/>
                </PatientProfileSectionScaffold>
            );
        } else {
            return <div>Please add demographic data via the API.</div>;
        }
    }
}

@connect(state => ({ data: state.patientProfile.data }))     //BACKEND BUG
class ImmunisationSection extends Component {
    constructor() {
        super();
        this.state = { addMore: false, newDate: moment(), newName: null };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd(ev) {
        this.setState({ addMore: !this.state.addMore, newDate: moment(), newName: null });
    }

    _handleInput(ev) {
        this.setState({ newName: ev.target.value });
    }


    _handleDateChange(date) {
        this.setState({
            newDate: date
        });
    }

    _handleSubmit(){
        console.log(this.state);
    }

    render() {
        const { data } = this.props;
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                { data.immunisations.length !== 0 ? 
                    <table>
                        <thead>
                            <tr><th>Vaccine name</th><th>Date</th></tr>
                        </thead>
                    </table>
                    : null }
                {!this.state.addMore ? <div className={cssButtons.createPatientButton} onClick={this._handleClickingAdd}>Add immunisation</div> : 
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td><input value={this.state.newName} onChange={this._handleInput} placeholder='vaccine name' name='vaccineName' type='text'/></td>
                                    <td><PickDate startDate={this.state.newDate} handleChange={this._handleDateChange}/></td>
                                </tr>
                            </tbody>
                        </table>
                        <div onClick={this._handleClickingAdd} className={cssButtons.createPatientButton}>Cancel</div>
                        <div className={cssButtons.createPatientButton} onClick={this._handleSubmit}>Submit</div>
                    </form> }
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
class MedicalHistorySection extends Component {
    render() {
        return (
            <div>
                <PatientProfileSectionScaffold sectionName='Existing Medical Conditions'>
                coming
                </PatientProfileSectionScaffold>
                <PatientProfileSectionScaffold sectionName='Family Medical History'>
                coming
                </PatientProfileSectionScaffold>
            </div>
        );
    }
}