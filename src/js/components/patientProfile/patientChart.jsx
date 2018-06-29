import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold, PatientProfileTop } from './sharedComponents.jsx';
import css from '../../../css/patientProfile.css.js';
import { NavLink } from 'react-router-dom';
import { getPatientProfileById } from '../../redux/actions/searchPatientById';
import store from '../../redux/store';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';

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
                    <Timeline/>
                    <Charts/>
                </div>
            </div>
        )
    }
}

class Timeline extends Component {   //unfinsihed
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Timeline'>
            </PatientProfileSectionScaffold>
        )
    }
}

class SubsectionsBar extends Component {
    render(){
        const style = {
            borderRadius: 10,
            paddingLeft: 20,
            height: 20,
            paddingTop: 4,
            textAlign: 'left',
            fontSize: 13,
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            width: '80%',
            marginRight: 0,
            marginLeft: 'auto',
            marginTop: 8,
            marginBottom: 8
        };
        switch (this.props.type) {
            case 'visit':
                return <div style={{ ...style, backgroundColor: '#8596B0', width: '90%' }}>{this.props.title}</div>
            case 'visitData':
                return <div style={{ ...style, backgroundColor: 'rgb(190, 189, 190)' }}>{this.props.title}</div>
            case 'medication':
                return <div style={{ ...style, backgroundColor: '#ffca1b' }}>{this.props.title}</div>
            case 'clinicalEvent':
                return <div style={{ ...style, backgroundColor: '#FF4745' }}>{this.props.title}</div>
            case 'test':
                return <div style={{ ...style, backgroundColor: '#99CA78' }}>{this.props.title}</div>
            default:
                return null;
        }
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
        return formatRow([testType, el['expectedOccurDate'], <NavLink id={`/patientProfile/${patientId}/test/${el.testId}`} to={`/patientProfile/${patientId}/test/${el.testId}`} activeClassName='selectedResult' style={style}><div style={divStyle}>results➠ </div></NavLink>]);
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

class VisitSection extends Component {
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
            <div>
                <SubsectionsBar type='visit' title={this.props.title}/>
                <div>
                    <SubsectionsBar type='visitData' title='Anthropometry and Vital signs'/>
                    <div style={style}>
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
                    </div>
                    <SubsectionsBar type='visitData' title='Sign and Symptoms'/>
                    <div style={style}>
                        
                    </div>

                    {visitHasTests ?
                        <div>
                            <SubsectionsBar type='test' title='Ordered tests'/>
                            <div style={style}>
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
                            </div>
                        </div> : null }

                    {visitHasMedications ?
                        <div>
                            <SubsectionsBar type='medication' title='Prescriptions'/>
                            <div style={style}>
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
                            </div>
                        </div> : null }

                    {visitHasClinicalEvents ? 
                        <div>
                            <SubsectionsBar type='clinicalEvent' title='Clinical events'/>
                            <div style={style}>
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
                            </div>
                        </div> : null }
                    <br/><br/><br/>
                </div>
            </div>
        )
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
                    {sortVisits(this.props.data.visits).map(
                        (el, ind) => <VisitSection availableFields={this.props.availableFields} key={el.visitId}  data={this.props.data} visitId={el.visitId} type='visit' title={`${ind+1}-th visit: ${el.visitDate}`}/>
                    )}
                </PatientProfileSectionScaffold>
            )
        }
    }
}



function sortVisits(visitList) {   //TEMPORARY: change how the date is parsed once the backend is patched...and change the sorting algorithm later...
    const parsedList = visitList.map(visit => {
        const firstInd = visit.visitDate.indexOf('/');
        const secondInd = visit.visitDate.indexOf('/', firstInd + 1);
        const dateReformated = visit.visitDate.slice(firstInd + 1, secondInd) + '/' + visit.visitDate.slice(0, firstInd) + '/' + visit.visitDate.slice(secondInd+1, visit.visitDate.length);  
        return `${new Date(`${visit.visitDate} UTC`).getTime()}||${visit.visitId}`;
    });
    parsedList.sort();
    const sortedVisits = [];
    console.log(parsedList)
    for (let each of parsedList) {
        console.log(each.split('||')[1]);
        let thisVisit = visitList.filter(visit => visit.visitId == each.split('||')[1])[0];  // eslint-disable-line eqeqeq
        sortedVisits.push(thisVisit);
    }
    return sortedVisits;
}