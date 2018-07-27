import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { displayEDSSCalc } from '../../redux/actions/edss';


export default class EditPerformanceMesaure extends Component {
    render() {
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Performance Measure</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <p> </p> <br /><br />
                    <NavLink to={`/patientProfile/${params.patientId}/edit/msPerfMeas/${params.visitId}/edss`}><button >Edit Expanded Disability Status Scale</button></NavLink>
                </form>
            </>
        );
    }
}
