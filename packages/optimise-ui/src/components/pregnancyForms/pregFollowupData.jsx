import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import style from '../patientProfile/patientProfile.module.css';
import moment from 'moment';
import { editPregnancyItemsCall } from '../../redux/actions/demographicData';
import pregnancy_style from './pregnancy.module.css';
import { BackButton } from '../medicalData/utils';
import PregnancyImageForm from './pregImage';

@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class PregnancyFollowupDataForm extends Component {
    constructor(props) {
        super();
        const { formRef } = props;

        if (formRef) {
            formRef(this);
        }

        this.state = this._getNewStateFromProps(props);

        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleOutcomeChange = this._handleOutcomeChange.bind(this);
        this._findDateRange = this._findDateRange.bind(this);
        this._validateFields = this._validateFields.bind(this);
        this._isValidDate = this._isValidDate.bind(this);
        this._getFirstMinuteOfDay = this._getFirstMinuteOfDay.bind(this);
        this._getLastMinuteOfDay = this._getLastMinuteOfDay.bind(this);
        this._getNewStateFromProps = this._getNewStateFromProps.bind(this);

    }

    componentDidUpdate(prevProps) {
        if (prevProps.entryId !== this.props.entryId) {
            // entryId prop has changed
            this.setState(this._getNewStateFromProps(this.props));
        }
    }

    _getNewStateFromProps(props) {
        const { entryId } = props;

        let matchedEntry = {};
        let matchedPregnancy = {};

        if (entryId) {
            const entriesFiltered = props.data.pregnancyEntries.filter((el) => parseInt(el.id) === entryId);

            if (entriesFiltered.length) {
                Object.assign(matchedEntry, entriesFiltered[0]);
            }

            if (matchedEntry.dataType === 'term') {
                const pregnanciesFiltered = props.data.pregnancy.filter((el) => el.id === matchedEntry.pregnancyId);

                if (pregnanciesFiltered.length) {
                    Object.assign(matchedPregnancy, pregnanciesFiltered[0]);
                }
            }
        }

        return ({
            dataType: matchedEntry.dataType ? matchedEntry.dataType : 'followup',
            LMP: matchedEntry.LMP ? moment(new Date(matchedEntry.LMP)) : moment(),
            maternalAgeAtLMP: matchedEntry.maternalAgeAtLMP,
            maternalBMI: matchedEntry.maternalBMI,
            EDD: matchedEntry.EDD ? moment(new Date(matchedEntry.EDD)) : moment(),
            numOfFoetuses: matchedEntry.numOfFoetuses,
            folicAcidSuppUsed: matchedEntry.folicAcidSuppUsed ? matchedEntry.folicAcidSuppUsed : 'no',
            folicAcidSuppUsedStartDate: matchedEntry.folicAcidSuppUsedStartDate ? moment(new Date(matchedEntry.folicAcidSuppUsedStartDate)) : moment(),
            illicitDrugUse: matchedEntry.illicitDrugUse ? matchedEntry.illicitDrugUse : 'no',
            pregnancyId: matchedEntry.pregnancyId,
            visitId: matchedEntry.visitId,
            outcomeApplicable: matchedEntry.dataType === 'term' ? 'yes' : 'no',
            pregnancyOutcome: matchedPregnancy.outcome,
            outcomeDate: matchedPregnancy.outcomeDate ? moment(parseInt(matchedPregnancy.outcomeDate)) : moment(),
            saved: false,
        });
    }


    _handleSubmit(ev) {
        //submit as followup entry to PATIENT_PREGNANCY_DATA table
        //if outcome is selected, then update the 
        ev.preventDefault();


        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.props.entryId) {
            return;
        }

        const validationErrorMessage = this._validateFields();

        if (validationErrorMessage) {
            this.setState({ error: validationErrorMessage });
            return;
        }

        const body = {
            patientId: this.props.data.patientId,
            data: {
                id: this.props.entryId,
                dataType: this.state.dataType,
                LMP: this.state.LMP ? this.state.LMP.toISOString() : null,
                maternalAgeAtLMP: this.state.maternalAgeAtLMP,
                maternalBMI: this.state.maternalBMI,
                EDD: this.state.EDD ? this.state.EDD.toISOString() : null,
                //ART: this.state.ART,
                numOfFoetuses: this.state.numOfFoetuses,
                folicAcidSuppUsed: this.state.folicAcidSuppUsed,
                folicAcidSuppUsedStartDate: this.state.folicAcidSuppUsedStartDate ? this.state.folicAcidSuppUsedStartDate.toISOString() : null,
                illicitDrugUse: this.state.illicitDrugUse,
            }

        };

        if (this.state.outcomeApplicable && this.state.pregnancyOutcome) {
            body.pregnancy = {
                id: this.state.pregnancyId,
                outcomeDate: this.state.dataType === 'term' && this.state.outcomeDate ? this.state.outcomeDate.toISOString() : null,
                outcome: this.state.dataType === 'term' && this.state.pregnancyOutcome ? parseInt(this.state.pregnancyOutcome, 10) : null,
            }
        }


        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyItemsCall(body))
            this.setState({ saved: true })
        });
    }


    _isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    _findDateRange(date, pregnancyId) {
        // Convert date to Date object
        date = new Date(parseFloat(date));

        let pregnancies = Array.from(this.props.data.pregnancy);

        let currentPregnancy;

        const index = pregnancies.findIndex(pregnancy => parseInt(pregnancy.id) === this.state.pregnancyId ? parseInt(this.state.pregnancyId) : parseInt(pregnancyId));


        // If the pregnancy is found, remove it from the list and return it
        if (index !== -1) {
            currentPregnancy = pregnancies.splice(index, 1)[0];
        }


        pregnancies.sort((a, b) => new Date(parseFloat(a.startDate)) - new Date(parseFloat(b.startDate)));

        // Find the pregnancy that is immediately after the given date
        let nextPregnancy = null;
        for (const pregnancy of pregnancies) {
            const startDate = new Date(parseFloat(pregnancy.startDate));
            if (startDate > date) {
                nextPregnancy = pregnancy;
                break;
            }
        }

        // If a next pregnancy is found, return its start date; otherwise, return null
        return {
            minDate: this._getFirstMinuteOfDay(new Date(parseFloat(currentPregnancy.startDate))),
            //maxDate: nextPregnancy ? this._getLastMinuteOfDay(new Date(parseFloat(nextPregnancy.startDate))) : null
            maxDate: this._getLastMinuteOfDay(date)
        }
    }

    _getLastMinuteOfDay(date) {
        const lastMinute = new Date(date);
        lastMinute.setHours(23, 59, 59, 999);
        return lastMinute;
    }

    _getFirstMinuteOfDay(date) {
        const firstMinute = new Date(date);
        firstMinute.setHours(0, 0, 0, 0);
        return firstMinute;
    }

    _validateFields(visitId, pregnancyId) {

        const currentVisit = this.props.data.visits.filter((el) =>
            parseInt(el.id) === (this.state.visitId ? parseInt(this.state.visitId) : parseInt(visitId))
        );


        if (this.state.outcomeApplicable === "no") {
            return ""
        }

        const dateLimit = this._findDateRange(currentVisit[0].visitDate, pregnancyId);

        if (this.state.outcomeApplicable === "yes" && this._getLastMinuteOfDay(new Date(parseFloat(currentVisit[0].visitDate))) < this.state.outcomeDate.toDate()) {
            return "Outcome date cannot come after visit date (Visit date is " + new Date(parseFloat(currentVisit[0].visitDate)).toDateString() + ")"
        }


        if (this._isValidDate(dateLimit.maxDate) && (this.state.outcomeDate.toDate() > dateLimit.maxDate) ||
            this._isValidDate(dateLimit.minDate) && (this.state.outcomeDate.toDate() < dateLimit.minDate)) {

            return "Outcome date conflicts with start date or existing pregnancies. Min viable date: " +
                (this._isValidDate(dateLimit.minDate) ? dateLimit.minDate.toDateString() : "No limit") +
                " Max viable date: " +
                (this._isValidDate(dateLimit.maxDate) ? dateLimit.maxDate.toDateString() : "No limit")
        }

        if (this.state.outcomeApplicable === "yes" && (!this.state.outcomeDate || this.state.pregnancyOutcome === 'none' || !this.state.pregnancyOutcome)) {

            return "Please enter both outcome date and outcome"
        }

        return "";
    }

    _handleDateChange(date, field) {
        this.setState({
            [field]: date,
            error: false
        });
    }

    _handleInputChange(event, field) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [field]: value,
            error: false
        });
    }

    _handleOutcomeChange(event) {
        this.setState({
            outcomeApplicable: event.target.value,
            dataType: event.target.value === 'yes' ? 'term' : 'followup',
            error: false

        });
    }


    render() {
        const { data, fields } = this.props;
        const { pregnancyOutcomes, meddra_Hash } = fields;

        return (
            <>
                {
                    this.props.renderedInFrontPage ?
                        null
                        :
                        <div className={style.ariane}>
                            <h2>Edit followup record</h2>
                            <BackButton to={`/patientProfile/${this.props.data.patientId}`} />
                        </div>
                }
                <div className={this.props.renderedInFrontPage ? null : style.panel}>

                    {/* <label>
                        Prenatal imaging:{' '}
                        <PickDate startDate={this.state.PNI_date} handleChange={(date) => this._handleDateChange(date, 'PNI_date')} /></label><br /><br /> */}

                    <div className={pregnancy_style.panel}>


                        <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={(date) => this._handleDateChange(date, 'EDD')} /></label><br /><br />

                        <label>Number of foetuses: <input value={this.state.numOfFoetuses} onChange={(event) => this._handleInputChange(event, 'numOfFoetuses')} /></label><br /><br />

                        <label>Maternal BMI: <input value={this.state.maternalBMI} onChange={(event) => this._handleInputChange(event, 'maternalBMI')} /></label><br /><br />

                        <label>Folic acid supplementation:
                            <select value={this.state.folicAcidSuppUsed}
                                onChange={(event) => this._handleInputChange(event, 'folicAcidSuppUsed')}>
                                <option value='yes'>Yes</option>
                                <option value='no'>No</option>
                            </select>
                        </label><br /><br />
                        {
                            this.state.folicAcidSuppUsed === 'yes' ?
                                <>
                                    <label>Folic acid supplementation start date:
                                        <PickDate startDate={this.state.folicAcidSuppUsedStartDate} handleChange={(date) =>
                                            this._handleDateChange(date, 'folicAcidSuppUsedStartDate')
                                        } />
                                    </label><br /><br />
                                </>
                                :
                                null
                        }

                        <label>Illicit drug use:
                            <select value={this.state.illicitDrugUse}
                                onChange={(event) => this._handleInputChange(event, 'illicitDrugUse')}>
                                <option value='yes'>Yes</option>
                                <option value='no'>No</option>
                            </select>
                        </label><br /><br />

                        {this.props.renderedInFrontPage &&
                            <>
                                <label>Would you like to add an outcome for this pregnancy?:
                                    <select value={this.state.outcomeApplicable}
                                        onChange={this._handleOutcomeChange}>
                                        <option value='yes'>Yes</option>
                                        <option value='no'>No</option>
                                    </select>
                                </label><br /> <br />
                            </>}

                        {
                            this.state.outcomeApplicable === 'yes'
                                || this.state.dataType === 'term'
                                ?
                                <>
                                    <label>Pregnancy end date:
                                        <PickDate startDate={this.state.outcomeDate} handleChange={(date) =>
                                            this._handleDateChange(date, 'outcomeDate')
                                        } />
                                    </label><br /><br />
                                    <label>Pregnancy outcome<br />
                                        <select value={this.state.pregnancyOutcome} onChange={(event) => this._handleInputChange(event, 'pregnancyOutcome')}>
                                            <option value='none'>None</option>
                                            {pregnancyOutcomes.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
                                            {/* <option value='term_delivery_healthy'>Term delivery healthy (&gt; 37 weeks)</option>
                                        <option value='preterm_delivery_healthy'>Pre-term delivery healthy (&lt; 37 weeks)</option>
                                        <option value='term_delivery_with_congenital_abnormality'>Term delivery with congenital abnormality (37 weeks)</option>
                                        <option value='preterm_delivery_with_congenital_abnormality'>Pre-Term delivery with congenital abnormality (37 weeks)</option>
                                        <option value='miscarrage_lt_20weeks'>Miscarriage (20weeks)</option>
                                        <option value='miscarrage_gt_20weeks'>Miscarriages (20weeks)</option>
                                        <option value='ectopic'>Ectopic Pregnancy</option>
                                        <option value='elective_termination'>Elective Termination</option>
                                        <option value='Neonatal death'>Neonatal death</option> */}
                                        </select>
                                    </label><br /><br />
                                </>
                                :
                                null
                        }

                        {
                            this.props.renderedInFrontPage ? null :
                                <>
                                    <PregnancyImageForm visitId={this.state.visitId}></PregnancyImageForm><br /><br />
                                </>
                        }

                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        {this.state.saved ? <><button disabled style={{ cursor: 'default', backgroundColor: 'green' }}>Successfully saved!</button><br /></> : null}


                        {this.props.renderedInFrontPage ? null :
                            <button type='submit' onClick={this._handleSubmit}>Save</button>
                        }

                    </div>
                </div>
            </>);
    }
}

export default PregnancyFollowupDataForm;
