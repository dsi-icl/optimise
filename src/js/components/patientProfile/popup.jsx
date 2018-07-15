import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cssDropdowns from '../../../css/dropdowns.module.css';

@connect(state => ({ visitList: state.patientProfile.data.visits, patientId: state.patientProfile.data.patientId }))
export class VisitPicker extends Component {
    render() {
        return (
            <div className={cssDropdowns.visitPicker}>
                To which visit?
                {this.props.visitList ?
                    this.props.visitList.map(visit =>
                        <NavLink key={visit.visitId} to={`/patientProfile/${this.props.patientId}/create/${visit.visitId}/${this.props.elementType}`}>
                            {new Date(parseInt(visit.visitDate, 10)).toDateString()}
                        </NavLink>)
                    : null}
            </div>
        );
    }
}