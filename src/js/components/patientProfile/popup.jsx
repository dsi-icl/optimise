import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssButtons from '../../../css/buttons.css';
import cssDropdowns from '../../../css/dropdowns.css';

@connect(state => ({ visitList: state.patientProfile.data.visits, patientId: state.patientProfile.patientId }))
export class VisitPicker extends Component {
    render() {
        return (
            <div className={cssDropdowns.visitPicker}>
                To which visit?
                {this.props.visitList ? this.props.visitList.map(visit => <div className={cssButtons.patientBanner}>{new Date(parseInt(visit.visitDate, 10)).toDateString()}</div>) : null}
            </div>
        )
    }
}