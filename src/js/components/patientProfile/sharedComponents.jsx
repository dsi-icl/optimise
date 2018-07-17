import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../icon';
import { BackButton } from '../medicalData/dataPage';

export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <>
                <h4>{this.props.sectionName}</h4><br />
                {this.props.children}<br /><br /><br />
            </>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
export class PatientProfileTop extends Component {
    render() {
        const { patientId } = this.props.data;
        return (
            <div className='profileActions'>
                <Link title='Create visit' to={`/patientProfile/${patientId}/createVisit`} ><Icon symbol='addVisit' /></Link>
                <Link title='Order test' to={`/patientProfile/${patientId}/create/test`}><Icon symbol='addTest' /></Link>
                <Link title='Add prescription' to={`/patientProfile/${patientId}/create/treatment`}><Icon symbol='addTreatment' /></Link>
                <Link title='Record event' to={`/patientProfile/${patientId}/create/clinicalEvent`}><Icon symbol='addEvent' /></Link>
                <BackButton to={'/searchPatient'} />
            </div>
        );
    }
}

