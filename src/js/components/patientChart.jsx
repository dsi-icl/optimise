import React, {Component} from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold, PatientProfileTop } from './patientProfile.jsx';
import css from '../../css/patientProfile.css.js';

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
            borderRadius: 20,
            paddingLeft: 20,
            height: 23,
            paddingTop: 5,
            textAlign: 'left',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            width: '80%',
            marginRight: 0,
            marginLeft: 'auto',
            marginTop: 5,
            marginBottom: 5
        };
        switch (this.props.type) {
        case 'visit':
            return <div style={{...style, backgroundColor: '#8596B0', width: '90%'}}>{this.props.title}</div>
        case 'visitData':
            return <div style={{...style, backgroundColor: '#D0CECF'}}>{this.props.title}</div>
        case 'medication':
            return <div style={{...style, backgroundColor: '#FEDA62'}}>{this.props.title}</div>
        case 'clinicalEvent':
            return <div style={{...style, backgroundColor: '#FF4745'}}>{this.props.title}</div>
        case 'test':
            return <div style={{...style, backgroundColor: '#99CA78'}}>{this.props.title}</div>
        default:
            return null;
        }
    }
}

class VisitSection extends Component {
    render() {
        const style={
            width: '80%',
            marginLeft: 'auto',
            marginRight: 0
        }
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
                        {this.props.data.tests
                            .filter(el => el['ordered_during_visit'] === this.props.visitId)
                            .map(
                            el => `type: ${el.type}, expected_occur_date: ${el['expected_occur_date']}`
                        )}
                    </div>
                    </div> : null }

                    {visitHasMedications ?
                    <div>
                    <SubsectionsBar type='medication' title='Prescriptions'/>
                    <div style={style}>
                        {this.props.data.treatments
                            .filter(el => el['ordered_during_visit'] === this.props.visitId)
                            .map(
                            el => (<span>{`drug: ${el.drug} | dose: ${el.dose} ${el.unit} (${el.form}), ${el['times_per_day']} times per day for ${el['duration_weeks']} weeks.`}<br/></span>)
                        )}
                    </div>
                    </div> : null }

                    {visitHasClinicalEvents ? 
                    <div>
                    <SubsectionsBar type='clinicalEvent' title='Clinical events'/>
                    <div style={style}>
                        {this.props.data.clinicalEvents
                            .filter(el => el['recorded_during_visit'] === this.props.visitId)
                            .map(
                            el => <span>type: {el.type}, start date: {el['date_start_date']}</span>
                        )}
                    </div>
                    </div> : null }
                    
                </div>
            </div>
        )
    }
}

class Charts_toConnect extends Component {   //unfinsihed
    render() {
        const style = {
            width: '90%'
        };
        if (this.props.fetching) {
            return null
        } else {
            return (  //make the server return visit in date order? ALSo, 1 = st, 2 =nd , 3 = rd
                <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY'>
                    {this.props.data.visits.map(
                        (el, ind) => <VisitSection key={el.visitId}  data={this.props.data} visitId={el.visitId} type='visit' title={`${ind+1}-th visit: ${el.visitDate}`}/>
                    )}
                </PatientProfileSectionScaffold>
            )
        }
    }
}

const Charts = connect(state => ({fetching: state.patientProfile.fetching, data: state.patientProfile.data}))(Charts_toConnect);