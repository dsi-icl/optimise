import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssButtons from '../../../css/buttons.module.css';
import cssDropdowns from '../../../css/dropdowns.module.css';
import { NavLink } from 'react-router-dom';

@connect(state => ({ visitList: state.patientProfile.data.visits, patientId: state.patientProfile.data.patientId }))
export class VisitPicker extends Component {
    render() {
        return (
            <div className={cssDropdowns.visitPicker}>
                To which visit?
                {this.props.visitList ? 
                    this.props.visitList.map(visit => 
                        <NavLink to={`/patientProfile/${this.props.patientId}/create/${visit.visitId}/${this.props.elementType}`} className={cssButtons.NavLink}>
                            <div className={cssButtons.patientBanner}>{new Date(parseInt(visit.visitDate, 10)).toDateString()}</div>
                        </NavLink>) 
                    : null}
            </div>
        )
    }
}