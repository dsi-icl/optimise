import React, { Component } from 'react';
import { connect } from 'react-redux';
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
                    <h2>MS Performance Measure</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <p>This is the communication for visit ///// </p> <br/><br/>

                    <span onClick={() => {store.dispatch(displayEDSSCalc());}}>EDSS calculator</span>
                </form>
            </>
        );
    }
}
