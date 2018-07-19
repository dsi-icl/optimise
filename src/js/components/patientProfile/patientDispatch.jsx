import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import style from './patientProfile.module.css';


//need to pass location to buttons  - do later

@connect(state => ({
    currentPatient: state.patientProfile.currentPatient
}))
export class PatientDispatch extends Component {
    render() {
        if (this.props.currentPatient === undefined || this.props.currentPatient === null)
            return <Redirect to='/searchPatient' />;
        else
            return <Redirect to={`/patientProfile/${this.props.currentPatient}`} />;
    }
}