import React, {Component} from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold, PatientProfileTop } from './patientProfile.jsx';
import css from '../../css/patientProfile.css.js';
import {NavLink} from 'react-router-dom';

export class PatientChart extends Component {
    render() {
        return (
            <div style={css.bigWrapper}>
                <PatientProfileTop/>
                <Timeline/>
                <Charts/>
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
            return <div style={{...style, backgroundColor: '#8596B0', width: '90%'}}>{this.props.title}</div>
        case 'visitData':
            return <div style={{...style, backgroundColor: 'rgb(190, 189, 190)'}}>{this.props.title}</div>
        case 'medication':
            return <div style={{...style, backgroundColor: '#ffca1b'}}>{this.props.title}</div>
        case 'clinicalEvent':
            return <div style={{...style, backgroundColor: '#FF4745'}}>{this.props.title}</div>
        case 'test':
            return <div style={{...style, backgroundColor: '#99CA78'}}>{this.props.title}</div>
        default:
            return null;
        }
    }
}

function mapTests(patientId) {
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
            borderRadius: 5
        };
        return formatRow([el.type, el['expected_occur_date'], <NavLink to={`/patientProfile/${patientId}/test/${el.testId}`} activeClassName='selectedResult' style={style}><div style={divStyle}>results </div></NavLink>]);
    }
}

function mapMedications(el) {
    return formatRow([el.drug, el.dose, el.unit, el.form, el['times_per_day'], el['duration_weeks']]);
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
            borderRadius: 5
        };
        return formatRow([el.type, el['date_start_date'], <NavLink to={`/patientProfile/${patientId}/ce/${el.id}`} activeClassName='selectedResult' style={style}><div style={divStyle}> results </div></NavLink>]);
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
        const visitHasTests = this.props.data.tests.filter(el => el['ordered_during_visit'] === this.props.visitId).length !== 0;
        const visitHasMedications = this.props.data.treatments.filter(el => el['ordered_during_visit'] === this.props.visitId).length !== 0;
        const visitHasClinicalEvents = this.props.data.clinicalEvents.filter(el => el['recorded_during_visit'] === this.props.visitId).length !== 0;
        return(
            <div>
                <SubsectionsBar type='visit' title={this.props.title}/>
                <div>
                    <SubsectionsBar type='visitData' title='Anthropometry and Vital signs'/>
                    <div style={style}>
                        
                    </div>
                    <SubsectionsBar type='visitData' title='Sign and Symptoms'/>
                    <div style={style}>
                        
                    </div>

                    {visitHasTests ?
                    <div>
                    <SubsectionsBar type='test' title='Ordered tests'/>
                    <div style={style}>
                        <table>
                            <tr><th>Type</th><th>Expected date</th></tr>
                        {this.props.data.tests
                            .filter(el => el['ordered_during_visit'] === this.props.visitId)
                            .map(mapTests(this.props.data.patientId))}
                        </table>
                    </div>
                    </div> : null }

                    {visitHasMedications ?
                    <div>
                    <SubsectionsBar type='medication' title='Prescriptions'/>
                    <div style={style}>
                        <table>
                            <tr><th>Drug</th><th>Dose</th><th>Unit</th><th>Form</th><th>Times per day</th><th>Duration in weeks</th></tr>
                        {this.props.data.treatments
                            .filter(el => el['ordered_during_visit'] === this.props.visitId)
                            .map(mapMedications)}
                        </table>
                    </div>
                    </div> : null }

                    {visitHasClinicalEvents ? 
                    <div>
                    <SubsectionsBar type='clinicalEvent' title='Clinical events'/>
                    <div style={style}>
                        <table>
                            <tr><th>Type</th><th>Start date</th></tr>
                        {this.props.data.clinicalEvents
                            .filter(el => el['recorded_during_visit'] === this.props.visitId)
                            /* change this map later to calculated patientId*/ 
                            .map(mapClinicalEvents(this.props.data.patientId))}
                        </table>
                    </div>
                    </div> : null }
                    <br/><br/><br/>
                </div>
            </div>
        )
    }
}

class Charts_toConnect extends Component {   //unfinsihed
    render() {
        if (this.props.fetching) {
            return null
        } else {
            return (  //make the server return visit in date order? ALSo, 1 = st, 2 =nd , 3 = rd
                <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY' suppressSectionBodyCss={true} bodyStyle={{...css.sectionBody, width: '100%'}}>
                    {this.props.data.visits.map(
                        (el, ind) => <VisitSection key={el.visitId}  data={this.props.data} visitId={el.visitId} type='visit' title={`${ind+1}-th visit: ${el.visitDate}`}/>
                    )}
                </PatientProfileSectionScaffold>
            )
        }
    }
}

const Charts = connect(state => ({fetching: state.patientProfile.fetching, data: state.patientProfile.data}))(Charts_toConnect);