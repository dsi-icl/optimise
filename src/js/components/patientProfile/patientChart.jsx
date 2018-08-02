import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { PatientProfileSectionScaffold, PatientProfileTop, EditButton } from './sharedComponents';
import { TimelineBox } from './timeline';
import Helmet from '../scaffold/helmet';
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
    componentDidMount() {
        store.dispatch(getPatientProfileById(this.props.match.params.patientId));
    }

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Patient Profile' />
                    <h2>Patient Profile {this.props.fetching ? '' : `(${this.props.data.patientId})`}</h2>
                    <PatientProfileTop />
                </div>
                <div className={`${style.panel} ${style.patientHistory}`}>
                    <span className={this.props.data.consent ? '' : style.noConsentAlert}>{`This patient ${this.props.data.consent ? 'consents' : 'does NOT consent'} to have their data shared for research purposes.`}</span><br /><br />
                    {this.props.fetching ? <div><Icon symbol='loading' /></div> :
                        <>
                            <TimelineBox />
                            <Charts location={this.props.location} />
                        </>
                    }
                </div>
            </>
        );
    }
}



/* receives a prop data of one test*/
@withRouter
@connect(state => ({ typedict: state.availableFields.testTypes_Hash[0], patientId: state.patientProfile.data.patientId }))
class Test extends PureComponent {
    render() {
        const { data, typedict, patientId } = this.props;
        const date = new Date(parseInt(data.expectedOccurDate, 10)).toDateString();
        return (
            <tr>
                <td><EditButton to={`/patientProfile/${patientId}/edit/test/${data.id}`} /></td>
                <td>{typedict[data.type]}</td>
                <td>{date}</td>
                <td>
                    <NavLink id={`test/${data.id}`} to={`/patientProfile/${patientId}/data/test/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Results</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

/* receives a prop data of one treatment */
@withRouter
@connect(state => ({ typedict: state.availableFields.drugs_Hash[0], patientId: state.patientProfile.data.patientId }))
class Medication extends PureComponent {
    render() {
        const { data, typedict, patientId } = this.props;
        const numberOfInterruptions = data.interruptions ? data.interruptions.length : 0;
        return (
            <tr>
                <td><EditButton to={`/patientProfile/${patientId}/edit/treatment/${data.id}`} /></td>
                <td>{`${typedict[data.drug].name} ${typedict[data.drug].module}`}</td>
                <td>{new Date(parseInt(data.startDate, 10)).toDateString()}</td>
                <td>{data.dose ? `${data.dose} ${data.unit}` : ''}</td>
                <td>{data.form ? data.form : ''}</td>
                <td>{data.times && data.intervalUnit ? `${data.times} times/${data.intervalUnit}` : ''}</td>
                <td>{numberOfInterruptions}</td>
                <td>
                    <NavLink id={`treatment/${data.id}`} to={`/patientProfile/${patientId}/data/treatment/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Interruptions</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

/* receives a prop data of one clinical event*/
@withRouter
@connect(state => ({ typedict: state.availableFields.clinicalEventTypes_Hash[0], patientId: state.patientProfile.data.patientId, meddraHash: state.availableFields.allMeddra[0] }))
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
                <td>{meddraHash[data.meddra]}</td>
                <td>
                    <NavLink id={`clinicalEvent/${data.id}`} to={`/patientProfile/${patientId}/data/clinicalEvent/${data.id}`} activeClassName={style.activeNavLink}>
                        <button>Data</button>
                    </NavLink>
                </td>
            </tr>

        );
    }
}

@connect(state => ({ typedict: state.availableFields.visitFields_Hash[0], patientId: state.patientProfile.data.patientId, inputType: state.availableFields.inputTypes_Hash[0] }))
class Symptom extends PureComponent {
    camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return '';
            return index === 0 ? match.toUpperCase() : match.toLowerCase();
        });
    }
    render() {
        const { data, typedict, inputType } = this.props;
        let value;
        switch (inputType[typedict[data.field].type]) {
            case 'B':
                value = data.value === '1' ? 'Yes' : 'False';
                break;
            case 'C':
                if (data.value === 'unselected')
                    return null;
                value = this.camelize(data.value);
                break;
            default:
                value = data.value;
        }
        return (
            <tr className={this.props.className}>
                <td>{typedict[data.field].idname.replace(/:/g, ' > ')}</td>
                <td>{value}</td>
            </tr>
        );
    }
}


export function formatRow(arr) {
    return arr.map((el, ind) => <td key={ind}>{el}</td>);
}

/**
 * @prop {Object} this.props.availableFieldsdata
 * @prop {String} visitId
 * @prop {Array} visitData
 * @prop {Object} data - state.patientProfile.data
 * @prop {String} title - `${this.props.data.visits.length-ind}-th visit`
 * @prop {Boolean} baselineVisit - Indicating whether it is a baseline visit
 */
class OneVisit extends Component {

    render() {
        const { baselineVisit, isMinor } = this.props;
        const visitHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === this.props.visitId).length !== 0;
        const allSymptoms = this.props.visitData.map(symptom => symptom.field);
        const VS = this.props.visitData.filter(el => [1, 2, 3, 4, 5, 6].includes(el.field));
        const VSHashTable = VS.reduce((map, field) => { map[field.field] = field.value; return map; }, {});
        const VSValueArray = [
            { name: 'Systolic blood pressure', value: VSHashTable['1'], unit: 'mmHg' },
            { name: 'Diastolic blood pressure', value: VSHashTable['3'], unit: 'mmHg' },
            { name: 'Heart rate', value: VSHashTable['2'], unit: 'bpm' },
            { name: 'Height', value: VSHashTable['4'], unit: 'cm' },
            { name: 'Weight', value: VSHashTable['5'], unit: 'kg' },
            { name: 'Academic concerns', value: isMinor ? VSHashTable['6'] === '0' ? 'No' : 'Yes' : undefined }
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
        const originalEditorState = communication ? EditorState.createWithContent(convertFromRaw(JSON.parse(communication))) : EditorState.createEmpty();

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
                id={`visit/${this.props.visitId}`}
                title={this.props.title}
                subtitle={this.props.subtitle}
                icon={<Icon symbol='addVisit' />}
                className={style.historyVisit}
                bubbleStyle={{ borderColor: 'transparent' }}>

                {this.props.visitType === 1 ? (
                    <>
                        <h4><Icon symbol='addVS' />&nbsp;ANTHROPOMETRY{isMinor ? ', ' : 'AND'} VITAL SIGNS{isMinor ? ' AND ACADEMIC CONCERNS' : ''}</h4>
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
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <h4><Icon symbol='symptom' />&nbsp;{baselineVisit ? 'FIRST SYMPTOMS INDICATING MS' : 'SYMPTOMS'}</h4>
                        {relevantSymptomsFields.length !== 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded symptoms</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {symptoms.map(el => <Symptom key={el.field} data={el} />)}
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
                        {relevantSignsFields.length !== 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded signs</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {signs.map(el => <Symptom key={el.field} data={el} />)}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ) : null}
                        <NavLink to={`/patientProfile/${this.props.data.patientId}/data/visit/${this.props.visitId}/signs`} activeClassName={style.activeNavLink}>
                            <button>Edit signs data for this visit</button>
                        </NavLink>
                        <br /><br />
                        <h4><Icon symbol='measure' />&nbsp;PERFORMANCE MEASURES</h4>
                        {relevantEDSSFields.length !== 0 ? (
                            <div className={style.visitWrapper}>
                                <table>
                                    <thead>
                                        <tr><th>Recorded performance measures</th><th>Value</th></tr>
                                    </thead>
                                    <tbody>
                                        {performances.map(el => {
                                            let isTotal = relevantEDSSFields.filter(f => f.id === el.field)[0].idname === 'edss:expanded disability status scale (edss) total';
                                            return <Symptom key={el.field} data={el} className={isTotal ? style.performanceHighlight : ''} />;
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

                {visitHasTests ? (
                    <>
                        <h4><Icon symbol='addTest' className={style.timelineTest} />&nbsp;{baselineVisit ? 'PREVIOUS TESTS' : 'TESTS'}</h4>
                        <div className={style.visitWrapper}>
                            <table className={style.editableTable}>
                                <thead>
                                    <tr><th></th><th>Type</th><th>Test date</th><th></th></tr>
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
                                    <tr><th></th><th>Treatment</th><th>Start date</th><th>Dose</th><th>Form</th><th>Frequency</th><th>#interruptions</th><th></th></tr>
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
                    </>
                ) : null
                }

            </TimelineEvent>
        );
    }
}


@connect(state => ({ data: state.patientProfile.data, availableFields: state.availableFields }))
export class Charts extends Component {
    constructor() {
        super();
        this.state = {
            filter: {
                tests: false,
                treatments: false,
                events: false,
                visits: false
            }
        };
        this._handleFilterSelection = this._handleFilterSelection.bind(this);
    }

    _handleFilterSelection = (filter) => {
        this.setState({
            filter: {
                ...this.state.filter,
                [filter]: !this.state.filter[filter]
            }
        });
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
                </div>
            }>
                {visits.length !== 0 ?
                    (
                        <Timeline className={style.history}>
                            {sortVisits(visits).map(
                                (el, ind) => {
                                    const order = visits.length - ind;
                                    let suffix;
                                    switch (order) {
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
                                    const baselineVisit = order === 1 ? true : false;
                                    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                    const visitDate = new Date(parseInt(el.visitDate, 10));
                                    return <OneVisit visitData={el.data}
                                        availableFields={this.props.availableFields}
                                        key={el.id} data={this.props.data}
                                        visitId={el.id}
                                        visitType={el.type}
                                        isMinor={new Date().getTime() - parseInt(DOB) < 568025136000}
                                        baselineVisit={baselineVisit}
                                        filter={this.state.filter}
                                        // title={el.type === 1 ? (baselineVisit ? `Baseline clinical visit (${order}${suffix} visit)` : `Clinical visit (${order}${suffix} visit)`) : ''}
                                        // subtitle={el.type === 1 ? visitDate.toLocaleDateString('en-GB', dateOptions) : ''} />;
                                        title={el.type === 1 ? (baselineVisit ? `Baseline clinical visit (${order}${suffix} visit)` : `Clinical visit (${order}${suffix} visit)`) : 'Isolated record'}
                                        subtitle={el.type === 1 ? visitDate.toLocaleDateString('en-GB', dateOptions) : `${visitDate.toLocaleDateString('en-GB', dateOptions)} ${visitDate.toLocaleTimeString()}`} />;
                                }
                            )}
                        </Timeline>
                    ) : (
                        <>
                            <br /><br />
                            <span>This patient currently has no visits nor baseline data. Please add a visit by clicking the button above. This will automatically count as the baseline visit / data.</span>
                        </>
                    )
                }
            </PatientProfileSectionScaffold>
        );
    }
}

function sortVisits(visitList) {
    const visits = [...visitList];
    return visits.sort((a, b) => parseInt(a.visitDate, 10) < parseInt(b.visitDate, 10));
}