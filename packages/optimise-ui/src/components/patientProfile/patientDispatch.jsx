import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

@connect(state => ({
    currentPatient: state.patientProfile.currentPatient
}))
export class PatientDispatch extends Component {
    render() {
        if (this.props.currentPatient === undefined || this.props.currentPatient === null)
            return <Navigate replace to={'/searchPatient'} />;
        else
            return <Navigate replace to={`/patientProfile/${this.props.currentPatient}`} />;
    }
}