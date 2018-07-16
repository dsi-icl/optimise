import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { PatientProfileSectionScaffold, PatientProfileTop } from './sharedComponents';
import { TimelineBox } from './timeline';
import { getPatientProfileById } from '../../redux/actions/searchPatient';
import store from '../../redux/store';
import Icon from '../icon';
import style from './patientProfile.module.css';

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
                    <h2>Patient Profile {this.props.fetching ? '' : `(${this.props.data.patientId})`}</h2>
                    <PatientProfileTop />
                </div>
                <div className={style.panel}>
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

function mapTests(patientId, typeMap) {
    return el => {
        const testType = typeMap.filter(ele => ele.id === el.type)[0].name;  //change this later, format when receiving state
        return (
            <tr key={el.testId} >
                {formatRow([testType,
                    new Date(parseInt(el['expectedOccurDate'], 10)).toDateString(),
                    <NavLink id={`test/${el.testId}`} to={`/patientProfile/${patientId}/data/test/${el.testId}`} activeClassName={style.activeNavLink}>
                        <button>Results</button>
                    </NavLink>
                ])}
            </tr>
        );
    };
}

function mapMedications(patientId, drugList) {
    return el => {
        const drugFiltered = drugList.filter(drug => drug.id === el.drug);
        const drug = drugFiltered.length === 1 ? `${drugFiltered[0].name} (${drugFiltered[0].module})` : el.drug;
        const numberOfInterruptions = el.interruptions ? el.interruptions.length : 0;
        return (
            <tr key={el.id} >
                {formatRow([drug, `${el.dose} ${el.unit}`, el.form, el['timesPerDay'], el['durationWeeks'], numberOfInterruptions,
                    <NavLink id={`treatment/${el.id}`} to={`/patientProfile/${patientId}/data/treatment/${el.id}`} activeClassName={style.activeNavLink}>
                        <button>Interruptions</button>
                    </NavLink>
                ])}
            </tr>
        );
    };
}

function mapClinicalEvents(patientId, typeList) {
    return el => {
        const typeFiltered = typeList.filter(type => type.id === el.type);
        const type = typeFiltered.length === 1 ? typeFiltered[0].name : el.type;
        const date = new Date(parseInt(el.dateStartDate, 10)).toDateString();
        return (
            <tr key={el.id} >
                {formatRow([type, date,
                    <NavLink id={`clinicalEvent/${el.id}`} to={`/patientProfile/${patientId}/data/clinicalEvent/${el.id}`} activeClassName={style.activeNavLink}>
                        <button>Results</button>
                    </NavLink>
                ])}
            </tr>
        );
    };
}

function mapSymptoms(fieldHashTable) {
    return el => {
        return (
            <tr key={el.field} >
                {formatRow([fieldHashTable[el.field].definition, el.value])}
            </tr>
        );
    };
}


export function formatRow(arr) {
    return arr.map((el, ind) => <td key={ind}>{el}</td>);
}

/**
 * @prop {Object} this.props.availableFieldsdata
 * @prop {String} visitId
 * @prop {Array} visitData
 * @prop {Object} data - state.patientProfile.data
 * @prop {String} type
 * @prop {String} title - `${this.props.data.visits.length-ind}-th visit`
 * @prop {String} visitDate - new Date(parseInt(el.visitDate, 10)).toDateString()
 * @prop {Boolean} baselineVisit - Indicating whether it is a baseline visit
 */
class OneVisit extends Component {
    render() {
        const { baselineVisit } = this.props;
        const visitHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === this.props.visitId).length !== 0;
        const allSymptoms = this.props.visitData.map(symptom => symptom.field);
        const VS = this.props.visitData.filter(el => [1, 2, 3, 4, 5, 6].includes(el.field));
        const VSHashTable = VS.reduce((map, field) => { map[field.field] = field.value; return map; }, {});
        const relevantFields = this.props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id));
        const fieldHashTable = relevantFields.reduce((map, field) => { map[field.id] = field; return map; }, {});
        const symptoms = this.props.visitData.filter(el => el.field > 6);
        return (
            <TimelineEvent
                id={`visit/${this.props.visitId}`}
                title={this.props.visitDate}
                subtitle={this.props.title}
                icon={<Icon symbol='addVisit' />}
                className={style.historyVisit}
                bubbleStyle={{ borderColor: 'transparent' }}>

                <h4><Icon symbol='addVS' />&nbsp;ANTHROPOMETRY AND VITAL SIGNS</h4>
                <table>
                    <tbody>
                        <tr>
                            <td >Systolic blood pressure: {`${VSHashTable['1']} mmHg`}</td>
                            <td >Diastolic blood pressure: {`${VSHashTable['3']} mmHg`}</td>
                        </tr>
                        <tr>
                            <td >Heart rate: {`${VSHashTable['2']} bpm`}</td>
                            <td >Height: {`${VSHashTable['4']} cm`}</td>
                        </tr>
                        <tr>
                            <td >Weight: {`${VSHashTable['5']} kg`}</td>
                            <td >Academic concern: {VSHashTable['6'] === '0' ? 'false' : VSHashTable['6'] ? 'true' : 'null'}</td>
                        </tr>
                    </tbody>
                </table>

                {relevantFields.length !== 0 ? (
                    <>
                        <h4><Icon symbol='symptom' />&nbsp;{baselineVisit ? 'FIRST SIGNS AND SYMPTOMS INDICATING MS' : 'SIGNS AND SYMPTOMS'}</h4>
                        <table>
                            <thead>
                                <tr><th>Recorded symptoms</th><th>Value</th></tr>
                            </thead>
                            <tbody>
                                {symptoms.map(mapSymptoms(fieldHashTable))}
                            </tbody>
                        </table>
                    </>
                ) : null}
                <br />
                <NavLink to={`/patientProfile/${this.props.data.patientId}/data/visit/${this.props.visitId}`} activeClassName={style.activeNavLink}>
                    <button>Edit / Add</button>
                </NavLink>

                {visitHasTests ? (
                    <>
                        <h4><Icon symbol='addTest' className={style.timelineTest} />&nbsp;{baselineVisit ? 'PREVIOUS TESTS' : 'ORDERED TESTS'}</h4>
                        <table>
                            <thead>
                                <tr><th>Type</th><th>Expected date</th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.tests
                                    .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                    .map(mapTests(this.props.data.patientId, this.props.availableFields.testTypes))}
                            </tbody>
                        </table>
                    </>
                ) : null
                }


                {visitHasMedications ? (
                    <>
                        <h4><Icon symbol='addTreatment' className={style.timelineMed} />&nbsp;{baselineVisit ? 'CONCOMITANT MEDICATIONS' : 'PRESCRIBED MEDICATIONS'}</h4>
                        <table>
                            <thead>
                                <tr><th>Drug</th><th>Dose</th><th>Form</th><th>Times per day</th><th>Duration (weeks)</th><th>#interruptions</th><th></th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.treatments
                                    .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                    .map(mapMedications(this.props.data.patientId, this.props.availableFields.drugs))}
                            </tbody>
                        </table>
                    </>
                ) : null
                }


                {visitHasClinicalEvents ? (
                    <>
                        <h4><Icon symbol='addEvent' className={style.timelineCE} />&nbsp;{baselineVisit ? 'PREVIOUS CLINICAL EVENTS' : 'CLINICAL EVENTS'}</h4>
                        <table>
                            <thead>
                                <tr><th>Type</th><th>Start date</th><th></th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.clinicalEvents
                                    .filter(el => el['recordedDuringVisit'] === this.props.visitId)
                                    /* change this map later to calculated patientId*/
                                    .map(mapClinicalEvents(this.props.data.patientId, this.props.availableFields.clinicalEventTypes))}
                            </tbody>
                        </table>
                    </>
                ) : null
                }
            </TimelineEvent>
        );
    }
}


@connect(state => ({ data: state.patientProfile.data, availableFields: state.availableFields }))
export class Charts extends Component {   //unfinsihed
    render() {
        const { visits } = this.props.data;
        return (
            <PatientProfileSectionScaffold sectionName='Medical History Summary'>
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
                                    return <OneVisit visitData={el.data}
                                        availableFields={this.props.availableFields}
                                        key={el.visitId} data={this.props.data}
                                        visitId={el.visitId}
                                        baselineVisit={baselineVisit}
                                        type='visit'
                                        title={baselineVisit ? `${order}${suffix} visit (Baseline visit)` : `${order}${suffix} visit (Ongoing assessment)`}
                                        visitDate={new Date(parseInt(el.visitDate, 10)).toDateString()} />;
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


function sortVisits(visitList) {   //TEMPORARY: change the sorting algorithm later...
    const visits = [...visitList];
    return visits.sort((a, b) => parseInt(a.visitDate, 10) < parseInt(b.visitDate, 10));
}