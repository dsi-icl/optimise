import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PatientProfileSectionScaffold } from './sharedComponents.jsx';

@connect(state => ({ fetching: state.patientProfile.fetching }))
export class Section extends Component {
    render() {
        if (this.props.fetching) {
            return <span> FETCHING PROFILE </span>
        } else {
            return (<div style={{ padding: '40px 40px', position: 'relative' }}>        
                <DemographicSection/>
                <ImmunisationSection/>
                <MedicalHistorySection/>
            </div>)
        }
    }
}

@connect(state => ({ demographicData: state.patientProfile.data.demographicData }))
class DemographicSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Profile'>
                {Object.entries(this.props.demographicData).map(el => <span key={el[0]}><b>{`${el[0].replace(/_/g, ' ')  }: `}</b>{el[1]}<br/></span>)}
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ immunisations: state.patientProfile.data.immunisations }))
class ImmunisationSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                coming
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ medicalHistory: state.patientProfile.data.medicalHistory }))
class MedicalHistorySection extends Component {
    render() {
        return (
            <div>
                <PatientProfileSectionScaffold sectionName='Existing Medical Conditions'>
                coming
                </PatientProfileSectionScaffold>
                <PatientProfileSectionScaffold sectionName='Family Medical History'>
                coming
                </PatientProfileSectionScaffold>
            </div>
        );
    }
}