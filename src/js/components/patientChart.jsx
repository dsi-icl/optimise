import React, {Component} from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold } from './patientProfile.jsx';

export class PatientChart extends Component {
    render() {
        return (
            <div>
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
            marginLeft: 'auto'
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

class Charts_toConnect extends Component {   //unfinsihed
    render() {
        if (this.props.fetching) {
            return null
        } else {
            return (  //make the server return visit in date order? ALSo, 1 = st, 2 =nd , 3 = rd
                <PatientProfileSectionScaffold sectionName='MEDICAL HISTORY SUMMARY'>
                    {this.props.data.visits.map((el, ind) => <SubsectionsBar type='visit' title={`${ind+1}-th visit: ${el.visitDate}`}/>)}   
                </PatientProfileSectionScaffold>
            )
        }
    }
}

const Charts = connect(state => ({fetching: state.patientProfile.fetching, data: state.patientProfile.data}))(Charts_toConnect);