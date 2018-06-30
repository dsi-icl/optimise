import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold, PatientProfileTop } from './sharedComponents.jsx';
import css from '../../../css/patientProfile.css.js';
import { NavLink } from 'react-router-dom';
import { getPatientProfileById } from '../../redux/actions/searchPatientById';
import store from '../../redux/store';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import { TimelineBox } from './timeline.jsx';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { AddVisitIcon, AddTestIcon, AddTreatmentIcon, AddEventIcon, AddVSIcon, SignAndSymptomIcon } from '../../../statics/svg/icons.jsx';

export class PatientChart extends Component {
    componentDidMount() {
        store.dispatch(getPatientProfileById(window.location.pathname.split('/')[2]));
    }

    render() {
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ zIndex: 1000, textAlign: 'center', height: 65, position: 'absolute', width: '100%', left: 0, Top: 0 }}>
                    <PatientProfileTop/>
                </div>
                <div style={{ zIndex: 998, height: 'calc(100% - 1.2em - 65px)', position: 'absolute', top: 65, overflow: 'auto', width: '100%', paddingBottom: 30, paddingLeft: 30, paddingRight: 30 }}>
                    <TimelineBox/>
                    <Charts/>
                </div>
            </div>
        )
    }
}

function mapTests(patientId, typeMap) {
    return el => {
        const style={
            cursor: 'pointer',
            backgroundColor: 'lightgrey',
            display: 'table',
            textDecoration: 'none',
            color: 'rgb(54, 58, 59)',
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5
        };
        const divStyle = {
            borderRadius: 5,
            paddingLeft: 3,
            paddingRight: 2
        };
        const testType = typeMap.filter(ele => ele.id === el.type)[0].name;  //change this later, format when receiving state
        return formatRow([testType, new Date(parseInt(el['expectedOccurDate'], 10)).toDateString(), <NavLink id={`/patientProfile/${patientId}/test/${el.testId}`} to={`/patientProfile/${patientId}/test/${el.testId}`} activeClassName='selectedResult' style={style}><div style={divStyle}>results➠ </div></NavLink>]);
    }
}

function mapMedications(el) {
    return formatRow([el.drug, el.dose, el.unit, el.form, el['timesPerDay'], el['durationWeeks']]);
}

function mapClinicalEvents(patientId) {
    return el => {
        const style={
            cursor: 'pointer',
            backgroundColor: 'lightgrey',
            display: 'table',
            textDecoration: 'none',
            color: 'rgb(54, 58, 59)',
            paddingLeft: 3,
            paddingRight: 3,
            borderRadius: 5
        };
        const divStyle = {
            borderRadius: 5,
            paddingLeft: 3,
            paddingRight: 2
        };
        return formatRow([el.type, <NavLink to={`/patientProfile/${patientId}/ce/${el.id}`} activeClassName='selectedResult' style={style}><div style={divStyle}> results➠ </div></NavLink>]);
    }
}

function formatRow(arr) {
    return <tr>{arr.map(el => <td>{el}</td>)}</tr>;
}
class OneVisit extends Component {
    render() {
        const style={
            width: '80%',
            marginLeft: 'auto',
            marginRight: 0,
            overflow: 'auto'
        };
        const inputStyle ={
            width: 40
        };
        const visitHasTests = this.props.data.tests.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['orderedDuringVisit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recordedDuringVisit'] === this.props.visitId).length !== 0;
        return(
            <TimelineEvent subtitleStyle={{ fontSize: '0.7rem' }} titleStyle={{ fontSize: '0.7rem', fontWeight: 'bold' }} contentStyle={{ backgroundColor: '#fcfcfc', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 50 }} icon={<AddVisitIcon style={{ fill: '#363A3B' }} width='2.5em'/>} bubbleStyle={{ backgroundColor: '#f5f6fa', border: null }} subtitle={this.props.title} title={this.props.visitDate}>
                <TimelineEvent titleStyle={{ fontWeight: 'bold', fontSize: '0.7rem' }} title='ANTHROPOMETRY AND VITAL SIGNS' contentStyle={{ backgroundColor: null, boxShadow: null }} icon={<AddVSIcon style={{ fill: '#ff6060' }} width='2.5em'/>} bubbleStyle={{ backgroundColor: null, border: null }}>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Systolic blood pressure: <input type='text' style={inputStyle}/>{' mmHg'}</td>
                                <td style={{ textAlign: 'left' }}>Diastolic blood pressure: <input type='text' style={inputStyle}/>{' mmHg'}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Heart rate: <input type='text' style={inputStyle}/>{' bpm'}</td>
                                <td style={{ textAlign: 'left' }}>Height: <input type='text' style={inputStyle}/>{' cm'}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Weight: <input type='text' style={inputStyle}/>{' kg'}</td>
                                <td style={{ textAlign: 'left' }}>Academic concern: <input type='text' style={inputStyle}/></td>
                            </tr>
                        </tbody>
                    </table>
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
            return <div style={{ textAlign: 'center', height: 100, width: 100, position: 'absolute', left: 200, top: 200, fill: '#ff5151' }}><LoadingIcon/></div>;
        } else {
            return (  //make the server return visit in date order? ALSo, 1 = st, 2 =nd , 3 = rd
                <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY' suppressSectionBodyCss={true} bodyStyle={{ ...css.sectionBody, width: '100%' }} titleButton={<div className='checkMark' title='create visit' style={{ marginRight: '1.5em', width: '1em', display: 'inline-block', float:'right' }}></div>}>
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