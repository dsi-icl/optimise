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
import cssSectioning from '../../../css/sectioning.css';
import cssScaffold from '../../../css/scaffold.css';
import cssButtons from '../../../css/buttons.css';
import cssIcons from '../../../css/icons.css';

export class PatientChart extends Component {
    componentDidMount() {
        store.dispatch(getPatientProfileById(window.location.pathname.split('/')[2]));
    }

    render() {
        return (
            <div className={cssScaffold.patientChart}>
                <div className={cssScaffold.patientChartTop}>
                    <PatientProfileTop/>
                </div>
                <div className={cssScaffold.patientChartBody}>
                    <TimelineBox/>
                    <Charts/>
                </div>
            </div>
        )
    }
}

function mapTests(patientId, typeMap) {
    return el => {
        const testType = typeMap.filter(ele => ele.id === el.type)[0].name;  //change this later, format when receiving state
        return formatRow([testType, 
            new Date(parseInt(el['expectedOccurDate'], 10)).toDateString(),
            <NavLink id={`/patientProfile/${patientId}/test/${el.testId}`} to={`/patientProfile/${patientId}/test/${el.testId}`} activeClassName='selectedResult' className={cssButtons.NavLink}>
                <div className={cssButtons.dataResultButton}>results➠ </div>
            </NavLink>
        ]);
    }
}

function mapMedications(el) {
    return formatRow([el.drug, el.dose, el.unit, el.form, el['timesPerDay'], el['durationWeeks']]);
}

function mapClinicalEvents(patientId) {
    return el => 
        formatRow([el.type, 
            <NavLink to={`/patientProfile/${patientId}/ce/${el.id}`} activeClassName='selectedResult' className={cssButtons.NavLink}>
                <div className={cssButtons.dataResultButton}> results➠ </div>
            </NavLink>
        ]);
}

function formatRow(arr) {
    return <tr>{arr.map((el, ind) => <td key={ind}>{el}</td>)}</tr>;
}
class OneVisit extends Component {
    render() {
        const visitHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === this.props.visitId).length !== 0;
        return(
            <TimelineEvent subtitleStyle={{ fontSize: '0.7rem' }} titleStyle={{ fontSize: '0.7rem', fontWeight: 'bold' }} contentStyle={{ backgroundColor: '#fcfcfc', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 50 }} icon={<AddVisitIcon style={{ fill: '#363A3B' }} width='2.5em'/>} bubbleStyle={{ backgroundColor: '#f5f6fa', border: null }} subtitle={this.props.title} title={this.props.visitDate}>
                <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='ANTHROPOMETRY AND VITAL SIGNS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddVSIcon style={{ fill: '#ff6060' }} width='2.5em'/>} bubbleStyle={{ backgroundColor: null, border: null }}>
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

                <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='SIGNS AND SYMPTOMS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<SignAndSymptomIcon style={{ fill: '#686868' }} width='2.5em'/>} bubbleStyle={{ backgroundColor: null, border: null }}>
                </TimelineEvent>
                
                
                {visitHasTests ?
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='ORDERED TESTS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddTestIcon style={{ fill: '#68e03a' }}/>} bubbleStyle={{ backgroundColor: null, border: null }}><div>
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
                    </div></TimelineEvent>: null
                }
                
                
                {visitHasMedications ?
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='PRESCRIBED MEDICATIONS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddTreatmentIcon style={{ fill: '#ffca1b' }}/>} bubbleStyle={{ backgroundColor: null, border: null }}><div>
                        <table>
                            <thead>
                                <tr><th>Drug</th><th>Dose</th><th>Unit</th><th>Form</th><th>Times per day</th><th>Duration in weeks</th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.treatments
                                    .filter(el => el['orderedDuringVisit'] === this.props.visitId)
                                    .map(mapMedications)}
                            </tbody>
                        </table>
                    </div></TimelineEvent> : null 
                }
                
                
                {visitHasClinicalEvents ? 
                    <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='CLINICAL EVENTS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddEventIcon style={{ fill: '#FF4745' }}/>} bubbleStyle={{ backgroundColor: null, border: null }}><div>
                        <table>
                            <thead>
                                <tr><th>Type</th><th>Start date</th></tr>
                            </thead>
                            <tbody>
                                {this.props.data.clinicalEvents
                                    .filter(el => el['recordedDuringVisit'] === this.props.visitId)
                                    /* change this map later to calculated patientId*/ 
                                    .map(mapClinicalEvents(this.props.data.patientId))}
                            </tbody>
                        </table>
                    </div></TimelineEvent> : null 
                }
            </TimelineEvent>
        );
    }
}


@connect(state => ({ fetching: state.patientProfile.fetching, data: state.patientProfile.data, availableFields: state.availableFields }))
export class Charts extends Component {   //unfinsihed
    render() {
        if (this.props.fetching) {
            return <div className={cssIcons.spinner}><LoadingIcon/></div>;
        } else {
            return (
                <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY' className={cssSectioning.sectionBody} bodyStyle={{ width: '100%' }}>
                    <Timeline lineColor='#d1d1d1'>
                        {sortVisits(this.props.data.visits).map(
                            (el, ind) => <OneVisit availableFields={this.props.availableFields} key={el.visitId}  data={this.props.data} visitId={el.visitId} type='visit' title={`${this.props.data.visits.length-ind}-th visit`} visitDate={new Date(parseInt(el.visitDate, 10)).toDateString()}/>
                        )}
                    </Timeline>
                </PatientProfileSectionScaffold>
            )
        }
    }
}



function sortVisits(visitList) {   //TEMPORARY: change the sorting algorithm later...
    const allVisitDates = visitList.map(visit => `${visit.visitDate}||${visit.visitId}`);
    allVisitDates.sort().reverse();
    const sortedVisits = [];
    console.log(allVisitDates)
    for (let each of allVisitDates) {
        console.log(each.split('||')[1]);
        let thisVisit = visitList.filter(visit => visit.visitId == each.split('||')[1])[0];  // eslint-disable-line eqeqeq
        sortedVisits.push(thisVisit);
    }
    return sortedVisits;
}