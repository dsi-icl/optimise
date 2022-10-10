import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

@connect(state => ({
    currentPatient: state.patientProfile.currentPatient
    }))
class PatientDispatch extends Component {
    render() {
        if (this.props.currentPatient === undefined || this.props.currentPatient === null)
            return <Redirect to='/searchPatient' />;
        else
            return <Redirect to={`/patientProfile/${this.props.currentPatient}`} />;
    }
}

export {PatientDispatch};