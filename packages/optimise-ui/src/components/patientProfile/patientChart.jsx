import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { edssAlgorithmFromProps } from '../EDSScalculator/calculator';
import { PatientProfileSectionScaffold, PatientProfileTop, EditButton } from './sharedComponents';
import { TimelineBox } from './timeline';
import Helmet from '../scaffold/helmet';
import { filterHistory } from '../../redux/actions/patientProfile';
import { getPatientProfileById } from '../../redux/actions/searchPatient';
import store from '../../redux/store';
import Icon from '../icon';
import style from './patientProfile.module.css';

//need to pass location to buttons  - do later

@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class PatientChart extends Component {
    constructor() {
        super();
        this.state = { hash: null };
    }
    componentDidMount() {
        store.dispatch(getPatientProfileById(this.props.match.params.patientId));
    }

    componentDidUpdate() {
        let hash = window.decodeURIComponent(window.location.hash);
        if (hash !== this.state.hash) {
            if (hash.trim() === '')
                return;
            let domElement = document.querySelector(hash);
            if (domElement) {
                window.location.hash = hash;
                this.setState({
                    hash
                }, () => {
                    domElement.scrollIntoView({
                        block: 'center',
                        inline: 'center'
                    });
                });
            }
        }
    }

    render() {

        if (!this.props.data.visits)
            return null;
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Patient Profile' />
                    <h2><Link to={`/patientProfile/${this.props.match.params.patientId}`}>Patient {this.props.fetching ? '' : `${this.props.data.patientId}`}</Link></h2>
                    <PatientProfileTop />
                </div>
                <div className={`${style.panel} ${style.patientHistory}`}>
                    {this.props.fetching ? <div><Icon symbol='loading' /></div> :
                        <>
                            <br />
                            <span className={this.props.data.participation ? '' : style.noConsentAlert}>{`This patient ${this.props.data.participation ? 'is enrolled in' : 'has withdrew from'} the study.`}</span><br /><br />
                            <span className={this.props.data.consent ? '' : style.noConsentAlert}>{`This patient ${this.props.data.consent ? 'consents' : 'does NOT consent'} to have their data shared for research purposes.`}</span><br /><br />
                            {this.props.data.visits.length > 0 ? <TimelineBox /> : null}
                            <Charts match={this.props.match} />
                        </>
                    }
                </div>
            </>
        );
    }
}

/* receives a prop data of one test*/
@withRouter
@connect(state => ({
    typedict: state.availableFields.testTypes_Hash[0],
    patientId: state.patientProfile.data.patientId
}))
class Test extends PureComponent {
    render() {
        const { data, typedict, patientId } = this.props;
        const dateDone = data.expectedOccurDate ? new Date(parseInt(data.expectedOccurDate, 10)).toDateString() : '';
        // const dateResults = data.actualOccurredDate ? new Date(parseInt(data.actualOccurredDate, 10)).toDateString() : dateDone;
        return (
            <tr>
                <td><EditButton to={`/patientProfile/${patientId}/edit/test/${data.id}`} /></td>
                <td>{typedict[data.type]}</td>
                <td>{dateDone}</td>
                {/* <td>{dateResults}</td> */}
                <td>
                    <NavLink id={`test-${data.id}`} to={`/patientProfile/${patientId}/data/test/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Results</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

/* receives a prop data of one treatment */
@withRouter
@connect(state => ({
    typedict: state.availableFields.drugs_Hash[0],
    patientId: state.patientProfile.data.patientId
}))
class Medication extends PureComponent {
    render() {
        const { data, typedict, patientId } = this.props;
        const numberOfInterruptions = data.interruptions ? data.interruptions.length : 0;
        if (!typedict[data.drug])
            return null;
        return (
            <tr>
                <td><EditButton to={`/patientProfile/${patientId}/edit/treatment/${data.id}`} /></td>
                <td>{`${typedict[data.drug].name} ${typedict[data.drug].module}`}</td>
                <td>{new Date(parseInt(data.startDate, 10)).toDateString()}</td>
                <td>{data.terminatedDate ? new Date(parseInt(data.terminatedDate, 10)).toDateString() : ''}</td>
                <td>{data.dose ? `${data.dose} ${data.unit}` : ''}</td>
                <td>{data.form ? data.form !== 'unselected' ? data.form : '' : ''}</td>
                <td>{data.times && data.intervalUnit ? `${data.times} times/${data.intervalUnit}` : ''}</td>
                <td>{numberOfInterruptions}</td>
                <td>
                    <NavLink id={`treatment-${data.id}`} to={`/patientProfile/${patientId}/data/treatment/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Interruptions</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

/* receives a prop data of one clinical event*/
@withRouter
@connect(state => ({
    typedict: state.availableFields.clinicalEventTypes_Hash[0],
    patientId: state.patientProfile.data.patientId,
    meddraHash: state.availableFields.meddra_Hash[0]
}))
class ClinicalEvent extends PureComponent {
    render() {
        const { data, typedict, patientId, meddraHash } = this.props;
        const date = new Date(parseInt(data.dateStartDate, 10)).toDateString();
        const endDate = data.endDate !== null && data.endDate !== undefined ? new Date(parseInt(data.endDate, 10)).toDateString() : '';
        return (
            <tr>
                <td><EditButton to={`/patientProfile/${patientId}/edit/clinicalEvent/${data.id}`} /></td>
                <td>{typedict[data.type]}</td>
                <td>{date}</td>
                <td>{endDate}</td>
                <td>{data.meddra ? meddraHash[data.meddra].name : null}</td>
                <td>
                    <NavLink id={`clinicalEvent-${data.id}`} to={`/patientProfile/${patientId}/data/clinicalEvent/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Data</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

const filterEmptyRenders = (allFields, inputType, typedict) => allFields.map(data => {

    const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    let value;
    switch (inputType[typedict[data.field].type]) {
        case 'B':
            if (data.value === '0')
                return null;
            value = data.value === '1' ? 'Yes' : 'No';
            break;
        case 'C':
            if (data.value === 'unselected')
                return null;
            if (!isNaN(parseFloat(data.value)))
                value = parseFloat(data.value);
            else
                value = toTitleCase(`${data.value}`);
            break;
        case 'I':
        case 'F':
            if (isNaN(parseFloat(data.value)))
                return null;
            value = parseFloat(data.value);
            break;
        default:
            if (!isNaN(parseFloat(data.value)))
                value = parseFloat(data.value);
            else
                value = data.value;
    }
    return {
        field: data.field,
        name: typedict[data.field].idname.replace(/:/g, ' > '),
        value
    };
}).filter(el => el !== null);

export const formatRow = (arr) => arr.map((el, ind) => <td key={ind}>{el}</td>);

/**
 * @prop {Object} this.props.availableFieldsdata
 * @prop {String} visitId
 * @prop {Array} visitData
 * @prop {Object} data - state.patientProfile.data
 * @prop {String} title - `${this.props.data.visits.length-ind}-th visit`
 * @prop {Boolean} baselineVisit - Indicating whether it is a baseline visit
 */
@connect(state => ({
    typedict: state.availableFields.visitFields_Hash[0],
    inputType: state.availableFields.inputTypes_Hash[0],
    icd11_Hash: state.availableFields.icd11_Hash[0]
}))
class OneVisit extends Component {

    render() {
        const { baselineVisit, isMinor } = this.props;
        const visitHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === this.props.visitId).length !== 0;
        const allSymptoms = this.props.visitData.map(symptom => symptom.field);
        const VS = this.props.visitData.filter(el => [0, 1, 2, 3, 4, 5, 6, 252, 253].includes(el.field));
        const VSHashTable = VS.reduce((map, field) => { map[field.field] = field.value; return map; }, {});
        const VSValueArray = [
            { name: 'Reason for the visit', value: VSHashTable['0'] },
            { name: 'Systolic blood pressure', value: VSHashTable['1'], unit: 'mmHg' },
            { name: 'Diastolic blood pressure', value: VSHashTable['3'], unit: 'mmHg' },
            { name: 'Heart rate', value: VSHashTable['2'], unit: 'bpm' },
            { name: 'Height', value: VSHashTable['4'], unit: 'cm' },
            { name: 'Weight', value: VSHashTable['5'], unit: 'kg' },
            { name: 'Smoking habit', value: VSHashTable['252'] },
            { name: 'Alcohol habit', value: VSHashTable['253'] },
            { name: 'Academic concerns', value: isMinor && VSHashTable['6'] ? VSHashTable['6'] === '1' ? 'Yes' : undefined : undefined }
        ].filter(e => !!e.value);
        const relevantSymptomsFields = this.props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id) && field.section === 2);
        const relevantSymptomsFieldsIdArray = relevantSymptomsFields.map(el => el.id);
        const symptoms = this.props.visitData.filter(el => el.field > 6 && relevantSymptomsFieldsIdArray.includes(el.field));
        const relevantSignsFields = this.props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id) && field.section === 3);
        const relevantSignsFieldsIdArray = relevantSignsFields.map(el => el.id);
        const signs = this.props.visitData.filter(el => el.field > 6 && relevantSignsFieldsIdArray.includes(el.field));
        const relevantEDSSFields = this.props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id) && /^edss:(.*)/.test(field.idname));
        const relevantEDSSFieldsIdArray = relevantEDSSFields.map(el => el.id);
        const performances = this.props.visitData.filter(el => el.field > 6 && relevantEDSSFieldsIdArray.includes(el.field));
        const communication = this.props.data.visits.filter(v => v.id === this.props.visitId)[0].communication;
        const comorbidities = this.props.data.comorbidities.filter(el => el.visit === this.props.visitId);
        const originalEditorState = communication ? EditorState.createWithContent(convertFromRaw(JSON.parse(communication))) : EditorState.createEmpty();

        const filteredSymptoms = filterEmptyRenders(symptoms, this.props.inputType, this.props.typedict);
        const filteredComorbidities = comorbidities;
        const filteredSigns = filterEmptyRenders(signs, this.props.inputType, this.props.typedict);
        const filteredEDSS = filterEmptyRenders(performances, this.props.inputType, this.props.typedict);

        if (this.props.visitType !== 1 && !visitHasTests && !visitHasMedications && !visitHasClinicalEvents)
            return null;

        let shouldRender = true;
        if (this.props.filter.visits || this.props.filter.tests || this.props.filter.treatments || this.props.filter.events) {
            shouldRender = false;
            if ((this.props.filter.visits && this.props.visitType === 1) ||
                (this.props.filter.tests && visitHasTests) ||
                (this.props.filter.treatments && visitHasMedications) ||
                (this.props.filter.events && visitHasClinicalEvents))
                shouldRender = true;
        }
        if (!shouldRender)
            return null;
        return (
            <TimelineEvent
                title={this.props.title}
                subtitle={this.props.subtitle}
                icon={<Icon symbol='addVisit' />}
                className={style.historyVisit}
                bubbleStyle={{ borderColor: 'transparent' }}>

                <a href={`visit-${this.props.visitId}`} className={style.visitAnchors} id={`visit-${this.props.visitId}`} >visit-${this.props.visitId}</a>

                {visitHasTests ? (
                    <>
                        <h4><Icon symbol='addTest' className={style.timelineTest} />&nbsp;{baselineVisit ? 'PREVIOUS TESTS' : 'TESTS'}</h4>
                        <div className={style.visitWrapper}>
                            <table className={style.editableTable}>
                                <thead>
                                    <tr><th></th><th>Type</th><th>Test date</th><th></th></tr>
                                    {/* <tr><th></th><th>Type</th><th>Test date</th><th>Results processing date</th><th></th></tr> */}
                                </thead>
                                <tbody>
                                    {this.props.data.tests
                                        .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                        .map(el => <Test key={el.id} data={el} />)}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : null
                }

                {visitHasMedications ? (
                    <>
                        <h4><Icon symbol='addTreatment' className={style.timelineMed} />&nbsp;{baselineVisit ? 'BASELINE TREATMENTS' : 'TREATMENTS'}</h4>
                        <div className={style.visitWrapper}>
                            <table className={style.editableTable}>
                                <thead>
                                    <tr><th></th><th>Treatment</th><th>Start date</th><th>End date</th><th>Dose</th><th>Form</th><th>Frequency</th><th>#interruptions</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {this.props.data.treatments
                                        .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                        .map(el => <Medication key={el.id} data={el} />)}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : null
                }

                {visitHasClinicalEvents ? (
                    <>
                        <h4><Icon symbol='addEvent' className={style.timelineCE} />&nbsp;{baselineVisit ? 'BASELINE CLINICAL EVENTS' : 'CLINICAL EVENTS'}</h4>
                        <div className={style.visitWrapper}>
                            <table className={style.editableTable}>
                                <thead>
                                    <tr><th></th><th>Type</th><th>Start date</th><th>End date</th><th>MedDRA</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {this.props.data.clinicalEvents
                                        .filter(el => el['recordedDuringVisit'] === this.props.visitId)
                                        /* change this map later to calculated patientId*/
                                        .map(el => <ClinicalEvent key={el.id} data={el} />)}
                                </tbody>
                            </table>
                        </div>
                        <br />
                    </>
                ) : null
                }

                {this.props.visitType === 1 ? (
                    <>
                        <NavLink to={`/patientProfile/${this.props.patientId}/edit/visit/${this.props.visitId}`} className={style.visitEditButton}>
                            <span title='Edit visit date and reason' className={style.dataEdit}><Icon symbol='edit' /></span>
                        </NavLink><br />
                        <h4><Icon symbol='addVS' />&nbsp;PHYSICAL MEASURES, VITAL SIGNS{isMinor ? ', ' : ' AND'} HABITS{isMinor ? ' AND ACADEMIC CONCERNS' : ''}</h4>
                        {VSValueArray.length > 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <tbody>
                                        {VSValueArray.length > 0 ?
                                            (
                                                <tr>
                                                    <td >{VSValueArray[0] ? `${VSValueArray[0].name}: ${VSValueArray[0].value} ${VSValueArray[0].unit ? VSValueArray[0].unit : ''}` : ''}</td>
                                                    <td >{VSValueArray[1] ? `${VSValueArray[1].name}: ${VSValueArray[1].value} ${VSValueArray[1].unit ? VSValueArray[1].unit : ''}` : ''}</td>
                                                </tr>
                                            ) : null}
                                        {VSValueArray.length > 2 ?
                                            (
                                                <tr>
                                                    <td >{VSValueArray[2] ? `${VSValueArray[2].name}: ${VSValueArray[2].value} ${VSValueArray[2].unit ? VSValueArray[2].unit : ''}` : ''}</td>
                                                    <td >{VSValueArray[3] ? `${VSValueArray[3].name}: ${VSValueArray[3].value} ${VSValueArray[3].unit ? VSValueArray[3].unit : ''}` : ''}</td>
                                                </tr>
                                            ) : null}
                                        {VSValueArray.length > 4 ?
                                            (
                                                <tr>
                                                    <td >{VSValueArray[4] ? `${VSValueArray[4].name}: ${VSValueArray[4].value} ${VSValueArray[4].unit ? VSValueArray[4].unit : ''}` : ''}</td>
                                                    <td >{VSValueArray[5] ? `${VSValueArray[5].name}: ${VSValueArray[5].value} ${VSValueArray[5].unit ? VSValueArray[5].unit : ''}` : ''}</td>
                                                </tr>
                                            ) : null}
                                        {VSValueArray.length > 6 ?
                                            (
                                                <tr>
                                                    <td >{VSValueArray[6] ? `${VSValueArray[6].name}: ${VSValueArray[6].value} ${VSValueArray[6].unit ? VSValueArray[6].unit : ''}` : ''}</td>
                                                    <td >{VSValueArray[7] ? `${VSValueArray[7].name}: ${VSValueArray[7].value} ${VSValueArray[7].unit ? VSValueArray[7].unit : ''}` : ''}</td>
                                                </tr>
                                            ) : null}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.patientId}/data/visit/${this.props.visitId}/vitals`} activeClassName={style.activeNavLink}>
                            <button>Edit physical measures{isMinor ? ', ' : ' and '}vital signs{isMinor ? ' and academic concerns' : ''} data for this visit</button>
                        </NavLink>
                        <br /><br />
                    </>
                ) : null}
                {this.props.visitType === 1 || visitHasClinicalEvents ? (
                    <>
                        <h4><Icon symbol='symptom' />&nbsp;{baselineVisit ? 'FIRST SYMPTOMS INDICATING MS' : 'SYMPTOMS'}</h4>
                        {filteredSymptoms.length > 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded symptoms</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredSymptoms.map(el => (
                                            <tr key={el.field}>
                                                <td>{el.name}</td>
                                                <td>{el.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/data/visit/${this.props.visitId}/symptoms`} activeClassName={style.activeNavLink}>
                            <button>Edit symptoms data for this visit</button>
                        </NavLink>
                        <br /><br />
                        <h4><Icon symbol='symptom' />&nbsp;{baselineVisit ? 'FIRST SIGNS INDICATING MS' : 'SIGNS'}</h4>
                        {filteredSigns.length !== 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded signs</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredSigns.map(el => (
                                            <tr key={el.field}>
                                                <td>{el.name}</td>
                                                <td>{el.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/data/visit/${this.props.visitId}/signs`} activeClassName={style.activeNavLink}>
                            <button>Edit signs data for this visit</button>
                        </NavLink>
                        <br /><br />
                    </>
                ) : null}

                {this.props.visitType === 1 ?
                    <>
                        <h4><Icon symbol='symptom' />&nbsp;COMORBIDITIES</h4>
                        {filteredComorbidities.length > 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <tbody>
                                        {filteredComorbidities.map(el =>
                                            this.props.icd11_Hash && this.props.icd11_Hash[el.comorbidity] ?
                                                <tr key={el.id}>
                                                    <td>{this.props.icd11_Hash[el.comorbidity].name}</td>
                                                </tr> : null
                                        )}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/edit/comorbidity/${this.props.visitId}`} activeClassName={style.activeNavLink}>
                            <button>Edit comorbidities</button>
                        </NavLink>
                        <br /><br /></>
                    : null}


                {this.props.visitType === 1 ? (
                    <>
                        <h4><Icon symbol='measure' />&nbsp;PERFORMANCE MEASURES</h4>
                        {filteredEDSS.length > 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded performance measures</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredEDSS.filter(el => isNaN(parseFloat(el.value)) !== true).map(el => {
                                            let isTotal = relevantEDSSFields.filter(f => f.id === el.field)[0].idname === 'edss:expanded disability status scale - estimated total';
                                            let EDSSComputed = edssAlgorithmFromProps(relevantEDSSFields, this.props.visitData);
                                            return (
                                                <Fragment key={el.field}>
                                                    <tr className={isTotal ? style.performanceHighlight : ''}>
                                                        <td>{el.name}</td>
                                                        <td>{el.value}</td>
                                                    </tr>
                                                    {isTotal && EDSSComputed !== '' ? (
                                                        <tr className={style.performanceHighlight}>
                                                            <td>edss > expanded disability status scale - computed total</td>
                                                            <td>{EDSSComputed}</td>
                                                        </tr>
                                                    ) : null}
                                                </Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/edit/msPerfMeas/${this.props.visitId}`} activeClassName={style.activeNavLink}>
                            <button>Edit performance measures data for this visit</button>
                        </NavLink>
                        <br /><br />
                        <h4><Icon symbol='communication' />&nbsp;COMMUNICATION</h4>
                        {communication ? (
                            <>
                                <div className={`${style.visitWrapper} ${style.editorSneak}`}>
                                    <Editor editorState={originalEditorState} onChange={() => null} />
                                </div><br />
                            </>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/edit/communication/${this.props.visitId}`} activeClassName={style.activeNavLink}>
                            <button>Edit or export the visit report</button>
                        </NavLink>
                        <br /><br />
                    </>
                ) : null}
            </TimelineEvent>
        );
    }
}

@connect(state => ({
    data: state.patientProfile.data,
    historyFilter: state.patientProfile.historyFilter,
    availableFields: state.availableFields
}))
export class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                tests: !!props.historyFilter.tests,
                treatments: !!props.historyFilter.treatments,
                events: !!props.historyFilter.events,
                visits: !!props.historyFilter.visits
            }
        };
        this._handleFilterSelection = this._handleFilterSelection.bind(this);
        this._sortVisits = this._sortVisits.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            filter: {
                tests: !!nextProps.historyFilter.tests,
                treatments: !!nextProps.historyFilter.treatments,
                events: !!nextProps.historyFilter.events,
                visits: !!nextProps.historyFilter.visits
            }
        };
    }

    _handleFilterSelection = (filter) => {
        store.dispatch(filterHistory({
            ...this.state.filter,
            [filter]: !this.state.filter[filter]
        }));
    }

    _sortVisits = (visitList) => {
        let historyInd = 1;
        const visits = [...visitList];
        return visits.sort((a, b) => {

            const aHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === a.id);
            const aHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === a.id);
            const aHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === a.id);

            let dateA = a.visitDate;
            if (aHasTests.length !== 0)
                dateA = aHasTests[0].actualOccurredDate || aHasTests[0].expectedOccurDate;
            if (aHasMedications.length !== 0)
                dateA = aHasMedications[0].startDate;
            if (aHasClinicalEvents.length !== 0)
                dateA = aHasClinicalEvents[0].dateStartDate;

            const bHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === b.id);
            const bHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === b.id);
            const bHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === b.id);

            let dateB = b.visitDate;
            if (bHasTests.length !== 0)
                dateB = bHasTests[0].actualOccurredDate || bHasTests[0].expectedOccurDate;
            if (bHasMedications.length !== 0)
                dateB = bHasMedications[0].startDate;
            if (bHasClinicalEvents.length !== 0)
                dateB = bHasClinicalEvents[0].dateStartDate;

            return parseInt(dateA, 10) - parseInt(dateB, 10);
        }).map(v => ({ ...v, historyInd: v.type === 1 ? historyInd++ : undefined })).reverse();
    }

    render() {
        if (!this.props.data.demographicData) {
            return null;
        }
        const { visits } = this.props.data;
        const { DOB } = this.props.data.demographicData;
        return (
            <PatientProfileSectionScaffold sectionName='Medical History Summary' header={
                <div className={style.filterBox}>
                    Filter by
                    <span onClick={() => this._handleFilterSelection('visits')} className={this.state.filter.visits ? style.selected : ''}>
                        <Icon symbol='addVS' />visits
                    </span>
                    <span onClick={() => this._handleFilterSelection('events')} className={this.state.filter.events ? style.selected : ''}>
                        <Icon symbol='addEvent' className={style.timelineCE} />events
                    </span>
                    <span onClick={() => this._handleFilterSelection('tests')} className={this.state.filter.tests ? style.selected : ''}>
                        <Icon symbol='addTest' className={style.timelineTest} />tests
                    </span>
                    <span onClick={() => this._handleFilterSelection('treatments')} className={this.state.filter.treatments ? style.selected : ''}>
                        <Icon symbol='addTreatment' className={style.timelineMed} /> treatments
                    </span>
                    <br />
                    <br />
                </div>
            }>
                {visits.length !== 0 ?
                    (
                        <Timeline className={style.history}>
                            {this._sortVisits(visits).map(
                                (el) => {
                                    if (el.data.length <= 0)
                                        return <React.Fragment key={el.id} ></React.Fragment>;
                                    let suffix = '';
                                    switch (el.historyInd) {
                                        case undefined:
                                            break;
                                        case 1:
                                            suffix = 'st';
                                            break;
                                        case 2:
                                            suffix = 'nd';
                                            break;
                                        case 3:
                                            suffix = 'rd';
                                            break;
                                        default:
                                            suffix = 'th';
                                    };
                                    const baselineVisit = el.historyInd === 1 ? true : false;
                                    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                    const visitDate = new Date(parseInt(el.visitDate, 10));
                                    const reasonForVisit = el.data.filter(el => el.field === 0);

                                    return <OneVisit visitData={el.data}
                                        patientId={this.props.match.params.patientId}
                                        availableFields={this.props.availableFields}
                                        key={el.id} data={this.props.data}
                                        visitId={el.id}
                                        visitType={el.type}
                                        isMinor={new Date().getTime() - parseInt(DOB) < 568025136000}
                                        baselineVisit={baselineVisit}
                                        filter={this.state.filter}
                                        title={el.type === 1 ? (baselineVisit ? `Baseline visit (${el.historyInd}${suffix} visit)` : `${reasonForVisit ? reasonForVisit[0].value : 'Clinical'} visit (${el.historyInd}${suffix} visit)`) : 'Additional record'}
                                        subtitle={`${el.type === 1 ? '' : 'Recorded on'} ${visitDate.toLocaleDateString('en-GB', dateOptions)}`} />;
                                }
                            )}
                        </Timeline>
                    ) : (
                        <span>This patient currently has no visits nor baseline data. Please add a visit by clicking the button above. This will automatically count as the baseline visit / data.</span>
                    )
                }
            </PatientProfileSectionScaffold>
        );
    }
}
