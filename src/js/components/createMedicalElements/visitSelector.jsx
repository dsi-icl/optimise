import React, { Component } from 'react';
import { VisitPicker } from '../patientProfile/popup';
import { BackButton } from '../medicalData/dataPage';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
export class VisitSelector extends Component {
    render() {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Select a visit for new {params.type}</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <div className={style.panel}>
                        <span><i>For which visit you would like to create this element?</i></span><br /><br />
                        <VisitPicker elementType={params.type} />
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}