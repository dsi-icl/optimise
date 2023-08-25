import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from '../medicalData/utils';
import Icon from '../icon';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from '../medicalData/dataPage.module.css';
import store from '../../redux/store';
import PregnancyImageForm from './pregImage';
import moment from 'moment';
import { createPregnancyDataAPICall, createPregnancyItemsCall, alterPregnancyItemsCall } from '../../redux/actions/demographicData';
import { PickDate } from '../createMedicalElements/datepicker';
import profile_style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';


const MemoizedDataFields = React.memo(function MemoizedDataFields({
    references,
    originalValues,
    fieldTree,
    inputTypeHash
}) {

    return (
        <>
            {Object.entries(fieldTree).map(mappingFields(inputTypeHash, references, originalValues))}
        </>
    );
});

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile,
        data: state.patientProfile.data
    };
}

/**
 * @class DataTemplate
 * @description Renders the data page for test / visit / treatment / event data
 * @prop {String} this.props.elementType - 'test', 'visit', 'treatment', 'clinicalEvent'
 * @prop {Object} this.props.match - from router
 * @prop {Object} this.props.fields - from store
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 *
 * Pregnancy entry type names by id: 
 * 1 - Baseline,
 * 2 - Follow up.
 * 3 - Term
 * 
 * /

/* this component serves as a sieve for the data and pass the relevant one to the form as props*/
@withRouter
@connect(mapStateToProps)
class PregnancyEntry extends Component {
    constructor(props) {
        super();

        const { childRef } = props;
        if (childRef) {
            childRef(this);
        }

        this.state = PregnancyEntry._getNewStateFromProps(props);


        this._formatBody = this._formatBody.bind(this);
        this._handleStartDateChange = this._handleStartDateChange.bind(this);
        this._handleOutcomeDateChange = this._handleOutcomeDateChange.bind(this);
        this._handleOutcomeChange = this._handleOutcomeChange.bind(this);
        this._handleOutcomeApplicableChange = this._handleOutcomeApplicableChange.bind(this);
        this._validateFields = this._validateFields.bind(this);
        this._getFirstMinuteOfDay = this._getFirstMinuteOfDay.bind(this);
        this._getLastMinuteOfDay = this._getLastMinuteOfDay.bind(this);
        this._findDateRange = this._findDateRange.bind(this);
        //this._checkIfTermEntry = this._checkIfTermEntry.bind(this);
        //this._getPregnancyStatus = this._getPregnancyStatus.bind(this);
        //this._isValidDate = this._isValidDate.bind(this);
        //this._getNewStateFromProps = this._getNewStateFromProps.bind(this);

        this.references = {};
        this.originalValues = {};
        this.fieldTree = {};
        this.inputTypeHash = {};
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    static _getNewStateFromProps(props) {
        const { patientProfile, data, match } = props;
        const { params } = match;

        let createEntry = false;
        let matchedEntry = {};
        let matchedPregnancy = {};
        let outcomeApplicable = 'no';
        if (!patientProfile.fetching) {
            const entriesFiltered = data.pregnancyEntries.filter((el) => parseInt(el.recordedDuringVisit) === parseInt(params.visitId));
            if (entriesFiltered.length > 0) {

                if (entriesFiltered.length) {
                    Object.assign(matchedEntry, entriesFiltered[0]);
                }

            } else {

                const currentVisitId = parseInt(params.visitId);
                const currentVisit = data.visits.filter((el) => parseInt(el.id) === currentVisitId);
                const currentVisitDate = new Date(parseFloat(currentVisit[0].visitDate));
                const pregnancyStatus = PregnancyEntry._getPregnancyStatus(currentVisitDate, data.pregnancy);
                if (props.renderedInFrontPage) {
                    createEntry = true;
                }


                matchedEntry = {
                    data: [],
                    type: pregnancyStatus.typeId,
                    visitId: params.visitId,
                    pregnancyId: pregnancyStatus.pregnancyId

                }
            }
        }


        if (matchedEntry.pregnancyId) {
            const pregnanciesFiltered = data.pregnancy.filter((el) => el.id === matchedEntry.pregnancyId);

            if (pregnanciesFiltered.length) {
                Object.assign(matchedPregnancy, pregnanciesFiltered[0]);
            }
        }

        if (matchedEntry.id && matchedPregnancy.id) {

            if (PregnancyEntry._checkIfTermEntry(matchedEntry, matchedPregnancy, data)) {
                outcomeApplicable = 'yes';
            }
        }



        return ({
            // entryType: 'baseline',
            pregnancyEntry: matchedEntry,
            pregnancyId: matchedPregnancy.id,
            pregnancyStartDate: matchedPregnancy.startDate ? moment(parseInt(matchedPregnancy.startDate)) : moment(),
            pregnancyOutcomeDate: matchedPregnancy.outcomeDate ? moment(parseInt(matchedPregnancy.outcomeDate)) : moment(),
            pregnancyOutcome: matchedPregnancy.outcome,
            createEntry: createEntry,
            outcomeApplicable: outcomeApplicable,
            saved: false
        });
    }

    static _checkIfTermEntry(entry, pregnancy, data) {

        let pregnancyId = entry.pregnancyId;
        const allPregnancyEntries = data.pregnancyEntries.filter((el) => parseInt(el.pregnancyId) === parseInt(pregnancyId));



        let latestEntry = null;
        let latestVisitDate = new Date(0);

        for (let entry of allPregnancyEntries) {

            let visit = data.visits.find(el => parseInt(el.id) === parseInt(entry.recordedDuringVisit));

            if (visit) {
                let visitDate = new Date(parseInt(visit.visitDate));

                if (visitDate > latestVisitDate) {
                    latestVisitDate = visitDate;
                    latestEntry = entry;
                }
            }
        }

        if (latestEntry && latestEntry.id === entry.id && typeof pregnancy.outcome === 'number' && pregnancy.outcomeDate) {
            return true;
        }

        return false;


    }


    initializeState() {
        const { fields, patientProfile } = this.props;

        if (!patientProfile.fetching) {
            const newPregnancyState = PregnancyEntry._getNewStateFromProps(this.props);
            const pregnancyEntry = newPregnancyState.pregnancyEntry;
            const relevantFields = fields.pregnancyEntryFields.filter(el => (el.referenceType === pregnancyEntry.type));
            const inputTypeHash = fields.inputTypes.reduce((a, el) => { a[el.id] = el.value; return a; }, {});
            const fieldTree = createLevelObj(relevantFields);
            this.originalValues = pregnancyEntry.data.reduce((a, el) => { a[el.field] = el.value; return a; }, {});
            this.references = relevantFields.reduce((a, el) => { a[el.id] = { ref: React.createRef(), type: inputTypeHash[el.type] }; return a; }, {});
            this.inputTypeHash = inputTypeHash;
            this.fieldTree = fieldTree;

            this.setState({
                ...newPregnancyState,
                refreshReferences: true
            });
        }
    }

    componentDidMount() {
        this.initializeState();
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.match.params.visitId !== this.props.match.params.visitId ||
            prevProps.patientProfile.fetching !== this.props.patientProfile.fetching) {
            this.initializeState();
        }
    }



    _formatBody(update, add) {
        const { params } = this.props.match;
        const { outcomeApplicable, pregnancyEntry } = this.state;
        const entryType = outcomeApplicable === "yes" ? 3 : parseInt(pregnancyEntry.type);

        // 1 - baseline,
        // 2 - follow up,
        // 3 - term

        let body = {
            type: 'pregnancyEntry',
            patientId: params.patientId,
            pregnancy: {
                id: parseInt(this.state.pregnancyId),
                patient: parseInt(this.props.data.id),
            },

        };

        if (!checkIfObjIsEmpty(update, add)) {
            body.data = {
                pregnancyEntryId: this.state.pregnancyEntry.id,
                update, add
            }
        }

        if (entryType === 1) {
            body.pregnancy.startDate = this.state.pregnancyStartDate ? this.state.pregnancyStartDate.toISOString() : null;
        }
        else {
            body.pregnancy.outcome = entryType === 3 && this.state.pregnancyOutcome
                ? parseInt(this.state.pregnancyOutcome, 10) : null;
            body.pregnancy.outcomeDate = entryType === 3 && this.state.pregnancyOutcomeDate
                ? this.state.pregnancyOutcomeDate.toISOString() : null;
        }
        if (this.state.createEntry) {
            body.pregnancyEntry = {
                //type: outcomeApplicable ? 3 : parseInt(entryType), // if outcome is applicable, pregnancy entry type is 3 (term)
                type: this.state.pregnancyEntry.type,
                visitId: parseInt(params.visitId),
                pregnancyId: this.state.pregnancyEntry.pregnancyId //if the entry type is baseline, no pregnancy will have been created yet
            }
        }

        return body;
    }

    _handleSubmit(ev) {

        ev.preventDefault();

        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const { references, originalValues } = this;

        if (references === null)
            return;


        const validationErrorMessage = this._validateFields();

        if (validationErrorMessage) {
            this.setState({ error: validationErrorMessage });
            return;
        }

        const update = {};
        const add = {};
        Object.entries(references).forEach(el => {
            const fieldId = el[0];
            const reference = el[1].ref;
            const type = el[1].type;
            if (type === 'C' && (originalValues[fieldId] !== undefined || reference.current.value !== 'unselected')) {
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== reference.current.value)
                        update[fieldId] = reference.current.value;
                } else if (reference.current.value !== 'unselected') {
                    add[fieldId] = reference.current.value;
                }
            }
            if (['I', 'F', 'T'].includes(type) && (originalValues[fieldId] !== undefined || reference.current.value !== '' || reference.current.value !== undefined)) {
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== reference.current.value)
                        update[fieldId] = reference.current.value;
                } else if (reference.current.value !== '') {
                    add[fieldId] = reference.current.value;
                }
            }
            if (type === 'B') {
                const bool = reference.current.checked ? '1' : '0';
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== bool)
                        update[fieldId] = bool;
                } else if (bool !== '0') {
                    add[fieldId] = bool;
                }
            }
            if (type === 'D') {
                const value = reference.current.value;
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== value)
                        update[fieldId] = value;
                } else if (value !== '') {
                    add[fieldId] = value;
                }
            }
        });

        // if (checkIfObjIsEmpty(update, add)) {
        //     return;
        // }

        const body = this._formatBody(update, add);

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(

                alterPregnancyItemsCall(body, () => {
                    this.originalValues = Object.assign({}, this.originalValues, add);
                    this.setState({ saved: true });
                }));
        });
    }


    _findDateRange(date, entryType) {

        let pregnancies = Array.from(this.props.data.pregnancy);

        let currentPregnancy;

        const index = pregnancies.findIndex(pregnancy => parseInt(pregnancy.id) === this.state.pregnancyId);

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

        // maxDate is minimum of either the current date or the outcome date of the pregnancy if it exists
        if (entryType === 1) {
            let maxDate = date;
            if (currentPregnancy && currentPregnancy.outcomeDate && new Date(parseFloat(currentPregnancy.outcomeDate)) < date) {
                maxDate = new Date(parseFloat(currentPregnancy.outcomeDate));
            }

            return {
                minDate: relevantDate ? this._getFirstMinuteOfDay(relevantDate) : null,
                maxDate: this._getLastMinuteOfDay(maxDate),
            }
        }
        else {

            return {
                minDate: this._getFirstMinuteOfDay(new Date(parseFloat(currentPregnancy.startDate))),
                maxDate: this._getLastMinuteOfDay(date)
            }
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


    _validateFields() {

        const { visitId } = this.props.match.params;
        const { outcomeApplicable, pregnancyEntry } = this.state;
        const { data } = this.props;
        const { visits } = data;

        const entryType = outcomeApplicable === 'yes' ? 3 : parseInt(pregnancyEntry.type);

        if (entryType === 2) {
            return "";
        }

        const currentVisit = visits.find(el => parseInt(el.id) === parseInt(visitId));
        const visitDate = new Date(parseFloat(currentVisit.visitDate));

        const dateLimit = this._findDateRange(visitDate, entryType);



        const isValidDateRange = date => PregnancyEntry._isValidDate(date) && (
            date > dateLimit.maxDate || date < dateLimit.minDate
        );

        const formatDate = date => PregnancyEntry._isValidDate(date) ? date.toDateString() : "No limit";

        if ((entryType === 1 && this._getLastMinuteOfDay(visitDate) < this.state.pregnancyStartDate.toDate()) ||
            (entryType === 3 && this._getLastMinuteOfDay(visitDate) < this.state.pregnancyOutcomeDate.toDate())) {
            return `Entered pregnancy date cannot come after visit date (Visit date is ${visitDate.toDateString()})`;
        }

        if ((entryType === 1 && isValidDateRange(this.state.pregnancyStartDate.toDate()))) {
            return `Pregnancy start date conflicts with end date or existing pregnancies. Min viable date: 
            ${formatDate(dateLimit.minDate)} Max viable date: ${formatDate(dateLimit.maxDate)}`;
        }

        if ((entryType === 3 && isValidDateRange(this.state.pregnancyOutcomeDate.toDate()))) {
            return `Pregnancy end date conflicts with start date or existing pregnancies. Min viable date: 
            ${formatDate(dateLimit.minDate)} Max viable date: ${formatDate(dateLimit.maxDate)}`;
        }


        if (entryType === 3 && (!this.state.pregnancyOutcomeDate || !this.state.pregnancyOutcome || this.state.pregnancyOutcome === 'none')) {
            return 'Please enter both the outcome date and the outcome'
        }

        return "";
    }


    _handleStartDateChange(date) {
        this.setState({
            pregnancyStartDate: date,
            error: false
        });
    }

    _handleOutcomeDateChange(date) {
        this.setState({
            pregnancyOutcomeDate: date,
            error: false
        });
    }

    _handleOutcomeChange(ev) {
        this.setState({
            pregnancyOutcome: ev.target.value,
            error: false
        });
    }

    _handleOutcomeApplicableChange(ev) {
        this.setState({
            outcomeApplicable: ev.target.value,
            error: false
        });
    }

    static _isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    static _getPregnancyStatus(date, pregnancies) {

        const sortedPregnancies = pregnancies.sort((a, b) => {
            // Sort pregnancies in descending order based on startDate
            return new Date(parseFloat(b.startDate)) - new Date(parseFloat(a.startDate));
        });


        for (const pregnancy of sortedPregnancies) {
            const startDate = new Date(parseFloat(pregnancy.startDate));
            const outcomeDate = new Date(parseFloat(pregnancy.outcomeDate));

            if (startDate <= date && (!this._isValidDate(outcomeDate) || outcomeDate >= date)) {
                // Date falls within an ongoing pregnancy

                return {
                    pregnancyStartDate: startDate,
                    pregnancyId: parseInt(pregnancy.id),
                    entryType: 'followup',
                    typeId: 2
                };
            }

            if (this._isValidDate(outcomeDate) && outcomeDate < date) {
                // All pregnancies have concluded before the given date

                return {
                    entryType: 'baseline',
                    typeId: 1
                };

            }
        }

        // No pregnancies found
        return {
            entryType: 'baseline',
            typeId: 1
        };
    }


    render() {
        const { patientProfile, match, } = this.props;
        const { params } = match;
        const { pregnancyOutcomes } = this.props.fields;


        let _style = scaffold_style;
        if (this.props.override_style) {
            _style = { ...scaffold_style, ...this.props.override_style };
        }

        if (!patientProfile.fetching && this.state.pregnancyEntry) {

            let pregnancyEntry = this.state.pregnancyEntry;


            if (!pregnancyEntry || (!pregnancyEntry.id && !this.props.renderedInFrontPage)) {

                return <>
                    {!this.props.renderedInFrontPage ?
                        <div className={scaffold_style.ariane}>
                            <h2>EDIT PREGNANCY ENTRY</h2>
                            <BackButton to={`/patientProfile/${match.params.patientId}`} />
                        </div>
                        : null}
                    <div className={_style.panel}>
                        <i>We could not find the entry that you are looking for.</i>
                    </div>
                </>;
            }

            if (!this.references) {
                return null;
            }

            return (
                <>
                    {!this.props.renderedInFrontPage ?
                        <div className={scaffold_style.ariane}>
                            <h2>EDIT PREGNANCY ENTRY</h2>
                            <BackButton to={`/patientProfile/${match.params.patientId}`} />
                        </div>
                        : null}
                    <div className={`${scaffold_style.panel} ${style.topLevelPanel}`}>
                        <form className={style.form}>
                            <div className={`${style.levelBody} ${pregnancy_style.panel}`}>
                                {
                                    this.props.renderedInFrontPage && this.state.pregnancyEntry.type === 1 ?
                                        <>
                                            <p> Please enter details for a baseline pregnancy entry.</p><br /><br />
                                        </>
                                        : null
                                }
                                {
                                    this.props.renderedInFrontPage && this.state.pregnancyEntry.type === 2 || this.state.pregnancyEntry.type === 3 ?
                                        <>
                                            <p>Current ongoing pregnancy start date: {this.state.pregnancyStartDate && this.state.pregnancyStartDate.toString().slice(0, 10)}. Please enter details for a follow up pregnancy record.</p><br /><br />
                                        </>
                                        : null
                                }
                                <PregnancyImageForm visitId={params.visitId}></PregnancyImageForm><br /><br />
                                {this.state.pregnancyEntry.type === 1 ?
                                    <div>
                                        <label key="startDate">Pregnancy start date: <PickDate startDate={this.state.pregnancyStartDate} handleChange={(date) => this._handleStartDateChange(date)} /></label><br /><br />
                                    </div>
                                    : null
                                }
                                {this.props.renderedInFrontPage && (this.state.pregnancyEntry.type === 2 || this.state.pregnancyEntry.type === 3) ?
                                    <div>
                                        <label >Would you like to add an outcome for this pregnancy?:
                                            <select value={this.state.outcomeApplicable}
                                                onChange={this._handleOutcomeApplicableChange}>
                                                <option value='yes'>Yes</option>
                                                <option value='no'>No</option>
                                            </select>
                                        </label><br /> <br />
                                    </div>
                                    : null
                                }

                                {
                                    this.state.outcomeApplicable === 'yes'
                                        // || this.state.pregnancyEntry.type === 3
                                        ?
                                        <div>
                                            <label >Pregnancy end date:
                                                <PickDate startDate={this.state.pregnancyOutcomeDate} handleChange={(date) =>
                                                    this._handleOutcomeDateChange(date)
                                                } />
                                            </label><br /><br />
                                            <label >Pregnancy outcome<br />
                                                <select value={this.state.pregnancyOutcome} onChange={(event) => this._handleOutcomeChange(event)}>
                                                    <option value='none'>None</option>
                                                    {pregnancyOutcomes.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}

                                                </select>
                                            </label><br /><br />
                                        </div>
                                        :
                                        null
                                }
                                <div className='protected'>

                                    <MemoizedDataFields
                                        references={this.references}
                                        originalValues={this.originalValues}
                                        fieldTree={this.fieldTree}
                                        inputTypeHash={this.inputTypeHash}
                                    />

                                </div>


                            </div>
                            {this.state.saved ? <><button disabled style={{ cursor: 'default', backgroundColor: 'green' }}>Successfully saved!</button><br /></> : null}
                            {this.state.error ? <><div className={profile_style.error}>{this.state.error}</div><br /></> : null}
                            {
                                this.props.renderedInFrontPage
                                    ?
                                    null
                                    :
                                    <button onClick={this._handleSubmit} type='submit'>Save</button>
                            }
                        </form>
                    </div>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}

export { PregnancyEntry };