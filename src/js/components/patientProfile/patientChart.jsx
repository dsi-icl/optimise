import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold, PatientProfileTop } from './sharedComponents.jsx';
import { NavLink } from 'react-router-dom';
import { getPatientProfileById } from '../../redux/actions/searchPatientById';
import store from '../../redux/store';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import { TimelineBox } from './timeline.jsx';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { AddVisitIcon, AddTestIcon, AddTreatmentIcon, AddEventIcon, AddVSIcon, SignAndSymptomIcon } from '../../../statics/svg/icons.jsx';
import cssSectioning from '../../../css/sectioning.module.css';
import cssScaffold from '../../../css/scaffold.module.css';
import cssButtons from '../../../css/buttons.module.css';
import cssIcons from '../../../css/icons.module.css';

@connect(state => ({ fetching: state.patientProfile.fetching }))
export class PatientChart extends Component {
    componentDidMount() {
        store.dispatch(getPatientProfileById(this.props.match.params.patientId));
    }

    render() {
        return (
            <div className={cssScaffold.patientChart}>
                <div className={cssScaffold.patientChartTop}>
                    <PatientProfileTop />
                </div>
                {this.props.fetching ? <div className={cssIcons.spinner}><LoadingIcon /></div> :
                    <div className={cssScaffold.patientChartBody}>
                        <TimelineBox />
                        <Charts location={this.props.location} />
                    </div>
                }
            </div>
        );
    }
}

function mapTests(patientId, typeMap) {
    return el => {
        const testType = typeMap.filter(ele => ele.id === el.type)[0].name;  //change this later, format when receiving state
        return formatRow([testType,
            new Date(parseInt(el['expectedOccurDate'], 10)).toDateString(),
            <NavLink id={`test/${el.testId}`} to={`/patientProfile/${patientId}/data/test/${el.testId}`} activeClassName='selectedResult' className={cssButtons.NavLink}>
                <div className={cssButtons.dataResultButton}>results➠ </div>
            </NavLink>
        ]);
    };
}

function mapMedications(drugList) {
    return el => {
        const drugFiltered = drugList.filter(drug => drug.id === el.drug);
        const drug = drugFiltered.length === 1 ? `${drugFiltered[0].name} (${drugFiltered[0].module})` : el.drug;
        return formatRow([drug, el.dose, el.unit, el.form, el['timesPerDay'], el['durationWeeks']]);
    };
}

function mapClinicalEvents(patientId, typeList) {
    return el => {
        const typeFiltered = typeList.filter(type => type.id === el.type);
        const type = typeFiltered.length === 1 ? typeFiltered[0].name : el.type;
        const date = new Date(parseInt(el.dateStartDate, 10)).toDateString();
        return formatRow([type, date,
            <NavLink id={`clinicalEvent/${el.id}`} to={`/patientProfile/${patientId}/data/clinicalEvent/${el.id}`} activeClassName='selectedResult' className={cssButtons.NavLink}>
                <div className={cssButtons.dataResultButton}> results➠ </div>
            </NavLink>
        ]);
    };
}

function mapSymptoms(fieldHashTable) {
    return el => formatRow([fieldHashTable[el.field].definition, el.value]);
}


export function formatRow(arr) {
    return <tr>{arr.map((el, ind) => <td key={ind}>{el}</td>)}</tr>;
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
        const relevantFields = this.props.availableFields.visitFields.filter(field => allSymptoms.includes(field.id));
        const fieldHashTable = relevantFields.reduce((map, field) => { map[field.id] = field; return map; }, {});
        return (
            <TimelineEvent id={`visit/${this.props.visitId}`} subtitleStyle={{ fontSize: '0.8rem' }} titleStyle={{ fontSize: '0.7rem', fontWeight: 'bold' }} contentStyle={{ backgroundColor: '#fcfcfc', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 50, overflow: 'auto' }} icon={<AddVisitIcon style={{ fill: '#363A3B' }} width='2.5em' />} bubbleStyle={{ backgroundColor: '#f2f2f2', border: null }} subtitle={this.props.title} title={this.props.visitDate}>
                <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='ANTHROPOMETRY AND VITAL SIGNS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddVSIcon style={{ fill: '#ff6060' }} width='2.5em' />} bubbleStyle={{ backgroundColor: null, border: null }}>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Systolic blood pressure: {' mmHg'}</td>
                                <td style={{ textAlign: 'left' }}>Diastolic blood pressure: {' mmHg'}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Heart rate: {' bpm'}</td>
                                <td style={{ textAlign: 'left' }}>Height: {' cm'}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Weight: {' kg'}</td>
                                <td style={{ textAlign: 'left' }}>Academic concern: </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={cssButtons.dataResultButton}>edit➠ </div>
                </TimelineEvent>

                <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title={baselineVisit ? 'FIRST SIGNS AND SYMPTOMS INDICATING MS' : 'SIGNS AND SYMPTOMS'} contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<SignAndSymptomIcon style={{ fill: '#686868' }} width='2.5em' />} bubbleStyle={{ backgroundColor: null, border: null }}>
                    {allSymptoms.length !== 0 ? <table>
                        <thead>
                            <tr><th>Recorded symptoms</th><th>Value</th></tr>
                        </thead>
                        <tbody>
                            {this.props.visitData.map(mapSymptoms(fieldHashTable))}
                        </tbody>
                    </table> : null}
                    <NavLink to={`/patientProfile/${this.props.data.patientId}/data/visit/${this.props.visitId}`} activeClassName='selectedResult' className={cssButtons.NavLink}>
                        <div className={cssButtons.dataResultButton}>edit/add➠ </div>
                    </NavLink>
                </TimelineEvent>


                {visitHasTests ?
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title={baselineVisit ? 'PREVIOUS TESTS' : 'ORDERED TESTS'} contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddTestIcon style={{ fill: '#68e03a' }} />} bubbleStyle={{ backgroundColor: null, border: null }}><div>
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
                    </div></TimelineEvent> : null
                }


                {visitHasMedications ?
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title={baselineVisit ? 'CONCOMITANT MEDICATIONS' : 'PRESCRIBED MEDICATIONS'} contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddTreatmentIcon style={{ fill: '#ffca1b' }} />} bubbleStyle={{ backgroundColor: null, border: null }}><div>
                        <table>
                            <thead>
                                <tr><th>Drug</th><th>Dose</th><th>Unit</th><th>Form</th><th>Times per day</th><th>Duration in weeks</th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.treatments
                                    .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                    .map(mapMedications(this.props.availableFields.drugs))}
                            </tbody>
                        </table>
                    </div></TimelineEvent> : null
                }


                {visitHasClinicalEvents ?
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title={baselineVisit ? 'PREVIOUS CLINICAL EVENTS' : 'CLINICAL EVENTS'} contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddEventIcon style={{ fill: '#FF4745' }} />} bubbleStyle={{ backgroundColor: null, border: null }}><div>
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
                    </div></TimelineEvent> : null
                }
            </TimelineEvent>
        );
    }
}


@connect(state => ({ data: state.patientProfile.data, availableFields: state.availableFields }))
export class Charts extends Component {   //unfinsihed
    render() {
        const { visits } = this.props.data;
        console.debug(visits, sortVisits(visits));
        return (
            <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY' className={cssSectioning.sectionBody} bodyStyle={{ width: '100%' }}>

                {visits.length !== 0 ?
                    (<Timeline lineColor='#d1d1d1'>{sortVisits(visits).map(
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
                                title={baselineVisit ? `${order}-${suffix} visit (Baseline visit)` : `${order}-${suffix} visit (Ongoing assessment)`}
                                visitDate={new Date(parseInt(el.visitDate, 10)).toDateString()} />;
                        }
                    )}
                    </Timeline>
                    ) : (
                        <div>
                            <br /><br />
                            <span>This patient currently has no visits nor baseline data. Please add a visit by clicking the button above. This will automatically count as the baseline visit / data.</span>
                        </div>
                    )}

            </PatientProfileSectionScaffold>
        );
    }
}



function sortVisits(visitList) {   //TEMPORARY: change the sorting algorithm later...    
    return visitList.sort((a, b) => Number.parseInt(a.visitDate) < Number.parseInt(b.visitDate));;
}