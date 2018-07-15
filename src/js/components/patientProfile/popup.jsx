import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cssDropdowns from '../../../css/dropdowns.module.css';

@connect(state => ({ visitList: state.patientProfile.data.visits, patientId: state.patientProfile.data.patientId }))
export class VisitPicker extends Component {
    render() {
        return (
            <div className={cssDropdowns.visitPicker}>
                <span>To which visit?</span><br />
                {this.props.visitList ?
                    this.props.visitList.map(visit => (
                        <Link key={visit.visitId} to={`/patientProfile/${this.props.patientId}/create/${visit.visitId}/${this.props.elementType}`}>
                            {new Date(parseInt(visit.visitDate, 10)).toDateString()}
                        </Link>
                    ))
                    : null}
            </div>
        );
    }
}