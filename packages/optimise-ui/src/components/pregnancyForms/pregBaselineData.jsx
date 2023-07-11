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
import moment from 'moment';
// import profile_style from '../patientProfile/patientProfile.module.css';
//import style from '../medicalData/dataPage.module.css';
import style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';
import _scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import { BackButton } from '../medicalData/utils';
import { Link } from 'react-router-dom';
import { editPregnancyItemsCall } from '../../redux/actions/demographicData';
import PregnancyImageForm from './pregImage';


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class PregnancyBaselineDataForm extends Component {
    constructor(props) {
        super();
        const { formRef } = props;
        if (formRef) {
            formRef(this);
        }

        this.state = this._getNewStateFromProps(props);

        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._validateFields = this._validateFields.bind(this);
        this._findDateRange = this._findDateRange.bind(this);
        this._isValidDate = this._isValidDate.bind(this);
        this._getFirstMinuteOfDay = this._getFirstMinuteOfDay.bind(this);
        this._getLastMinuteOfDay = this._getLastMinuteOfDay.bind(this);

    }
    componentDidUpdate(prevProps) {
        if (prevProps.entryId !== this.props.entryId) {

            this.setState(this._getNewStateFromProps(this.props));
        }
    }

    _getNewStateFromProps(props) {
        const { entryId, data } = props;


        let matchedEntry = {};
        let matchedPregnancy = {};
        if (entryId) {
            const entriesFiltered = data.pregnancyEntries.filter((el) => parseInt(el.id) === entryId);

            if (entriesFiltered.length) {
                Object.assign(matchedEntry, entriesFiltered[0]);
            }

            const pregnanciesFiltered = data.pregnancy.filter((el) => el.id === matchedEntry.pregnancyId);

            if (pregnanciesFiltered.length) {
                Object.assign(matchedPregnancy, pregnanciesFiltered[0]);
            }
        }


        return ({
            dataType: 'baseline',
            visitId: matchedEntry.visitId,
            pregnancyId: matchedEntry.pregnancyId,
            LMP: matchedEntry.LMP ? moment(new Date(matchedEntry.LMP)) : moment(),
            maternalAgeAtLMP: matchedEntry.maternalAgeAtLMP,
            maternalBMI: matchedEntry.maternalBMI,
            EDD: matchedEntry.EDD ? moment(new Date(matchedEntry.EDD)) : moment(),
            ART: matchedEntry.ART ? matchedEntry.ART : 'none',
            numOfFoetuses: matchedEntry.numOfFoetuses,
            folicAcidSuppUsed: matchedEntry.folicAcidSuppUsed ? matchedEntry.folicAcidSuppUsed : 'no',
            folicAcidSuppUsedStartDate: matchedEntry.folicAcidSuppUsedStartDate ? moment(new Date(matchedEntry.folicAcidSuppUsedStartDate)) : moment(),
            illicitDrugUse: matchedEntry.illicitDrugUse ? matchedEntry.illicitDrugUse : 'no',
            startDate: matchedPregnancy.startDate ? moment(parseInt(matchedPregnancy.startDate)) : moment(),
            saved: false
        });
    }

    //static getDerivedStateFromProps(props, state) {
    //    if (props.match.params.ceId === state.ceId)
    //        return state;
    //    return {
    //        ...state,
    //        ceId: props.match.params.ceId,
    //        refreshReferences: true
    //    };
    //}
    //
    //componentDidUpdate() {
    //    if (this.state.refreshReferences === true) {
    //        this.references = null;
    //        this.setState({
    //            refreshReferences: false
    //        });
    //    }
    //}

    // _handleDateChange(date) {
    //     this.setState({
    //         startDate: date,
    //         error: false
    //     });
    // }

    _findDateRange(date, pregnancyId) {

        date = new Date(parseFloat(date));

        let pregnancies = Array.from(this.props.data.pregnancy);

        let currentPregnancy;

        const index = pregnancies.findIndex(pregnancy => parseInt(pregnancy.id) === this.state.pregnancyId ? parseInt(this.state.pregnancyId) : pregnancyId);

        if (index !== -1) {
            currentPregnancy = pregnancies.splice(index, 1)[0];
        }

        pregnancies.sort((a, b) => new Date(parseFloat(b.startDate)) - new Date(parseFloat(a.startDate)));

        // Find the pregnancy that most recently precedes the given date
        let mostRecentPregnancy = null;
        for (const pregnancy of pregnancies) {
            const outcomeDate = pregnancy.outcomeDate ? new Date(parseFloat(pregnancy.outcomeDate)) : new Date(parseFloat(pregnancy.startDate));
            if (outcomeDate < date) {
                mostRecentPregnancy = pregnancy;
                break;
            }
        }

        const relevantDate = mostRecentPregnancy ?
            (mostRecentPregnancy.outcomeDate ? new Date(parseFloat(mostRecentPregnancy.outcomeDate)) :
                new Date(parseFloat(mostRecentPregnancy.startDate))) : null;


        // maxDate is latest of either the current date or the outcome date of the pregnancy if it exists
        let maxDate;
        if (currentPregnancy && currentPregnancy.outcomeDate) {
            maxDate = new Date(parseFloat(currentPregnancy.outcomeDate)) > date ? new Date(parseFloat(currentPregnancy.outcomeDate)) : date;
        }

        return {
            minDate: relevantDate ? this._getFirstMinuteOfDay(relevantDate) : null,
            maxDate: maxDate ? this._getLastMinuteOfDay(maxDate) : this._getLastMinuteOfDay(date),
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

        //const currentVisit = this.props.data.visits.filter((el) => parseInt(el.id) === this.state.visitId);
        const currentVisit = this.props.data.visits.filter((el) =>
            parseInt(el.id) === (this.state.visitId ? this.state.visitId : parseInt(visitId))
        );

        const dateLimit = this._findDateRange(currentVisit[0].visitDate, pregnancyId);

        if (this._getLastMinuteOfDay(new Date(parseFloat(currentVisit[0].visitDate))) < this.state.startDate.toDate()) {
            return "Start date cannot come after visit date (Visit date is " + new Date(parseFloat(currentVisit[0].visitDate)).toDateString() + ")"
        }

        if (this._isValidDate(dateLimit.maxDate) && this.state.startDate.toDate() > dateLimit.maxDate ||
            this._isValidDate(dateLimit.minDate) && this.state.startDate.toDate() < dateLimit.minDate) {


            return "Start date conflicts with end date or existing pregnancies. Min viable date: " +
                (this._isValidDate(dateLimit.minDate) ? dateLimit.minDate.toDateString() : "No limit") +
                " Max viable date: " +
                (this._isValidDate(dateLimit.maxDate) ? dateLimit.maxDate.toDateString() : "No limit")
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
        this.setState({ [field]: value });
    }




    _isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }


    _handleSubmit(ev) {
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



        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the start date of the pregnancy'
            });
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
                ART: this.state.ART ? this.state.ART : 'none',
                numOfFoetuses: this.state.numOfFoetuses,
                folicAcidSuppUsed: this.state.folicAcidSuppUsed,
                folicAcidSuppUsedStartDate: this.state.folicAcidSuppUsedStartDate ? this.state.folicAcidSuppUsedStartDate.toISOString() : null,
                illicitDrugUse: this.state.illicitDrugUse,
            }

        };

        body.pregnancy = {
            id: this.state.pregnancyId,
            startDate: this.state.startDate ? this.state.startDate.toISOString() : null,
        }


        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyItemsCall(body))
            this.setState({ saved: true })
        });
    }

    render() {
        let scaffold_style = _scaffold_style;
        return (<>


            {
                this.props.renderedInFrontPage ?
                    null :
                    <div className={scaffold_style.ariane}>
                        <h2>Edit baseline record</h2>
                        <BackButton to={`/patientProfile/${this.props.data.patientId}`} />

                    </div>
            }
            <div

                //className={`${scaffold_style.panel} ${style.topLevelPanel}`}
                className={this.props.renderedInFrontPage ? null : style.panel}
            >

                <div className={pregnancy_style.panel}>


                    <label key="startDate">Pregnancy start date: <PickDate startDate={this.state.startDate} handleChange={(date) => this._handleDateChange(date, 'startDate')} /></label><br /><br />
                    <label>Date of last menstrual period (LMP): <PickDate startDate={this.state.LMP} handleChange={(date) => this._handleDateChange(date, 'LMP')} /></label><br /><br />
                    <label>Maternal age at LMP: <input value={this.state.maternalAgeAtLMP} onChange={(event) => this._handleInputChange(event, 'maternalAgeAtLMP')} /></label><br /><br />
                    <label key="maternalBMI">Maternal BMI: <input value={this.state.maternalBMI} onChange={(event) => this._handleInputChange(event, 'maternalBMI')} /></label><br /><br />
                    <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={(date) => this._handleDateChange(date, 'EDD')} /></label><br /><br />
                    <label>Assisted Reproductive Technology method:<br />
                        <select value={this.state.ART} onChange={(event) => this._handleInputChange(event, 'ART')}>
                            <option value='none'>None</option>
                            <option value='ivf'>IVF</option>
                            <option value='iui'>IUI</option>
                            <option value='ovulation drugs'>Ovulation Drugs</option>
                            <option value='others'>Others</option>
                        </select>
                    </label><br /><br />
                    <label>Number of foetuses: <input value={this.state.numOfFoetuses} onChange={(event) => this._handleInputChange(event, 'numOfFoetuses')} /></label><br /><br />
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
                                    <PickDate startDate={this.state.folicAcidSuppUsedStartDate} handleChange={(date) => this._handleDateChange(date, 'folicAcidSuppUsedStartDate')} />
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

            </div></>);
    }
}


export default PregnancyBaselineDataForm;