import React, { Component } from 'react';
import { BackButton } from '../medicalData/utils';
import style from './patientProfile.module.css';

export class DeletedPatient extends Component {

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <h2>Patient Profile</h2>
                    <BackButton to={'/searchPatient'} />
                </div>
                <div className={style.panel}>
                    The patient has been successfully deleted!
                </div>
            </>
        );
    }
}