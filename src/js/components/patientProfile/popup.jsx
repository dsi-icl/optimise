import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({ visitList: state.patientProfile.data.visits, patientId: state.patientProfile.patientId }))
export class VisitPicker extends Component {
    render() {
        return (
            <div className='visitPicker'>
                To which visit?
                {this.props.visitList ? this.props.visitList.map(visit => <div className='patientBanner'>{visit.visitDate}</div>) : null}
            </div>
        )
    }
}