import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './patientProfile.module.css';

@connect(state => ({
    visitList: state.patientProfile.data
        .visits, patientId: state.patientProfile.data.patientId
}))
export class VisitPicker extends Component {
    render() {
        return (
            <div>
                {this.props.visitList ?
                    this.props.visitList.map(visit => (
                        <React.Fragment key={visit.visitId}>
                            <Link to={`/patientProfile/${this.props.patientId}/create/${visit.visitId}/${this.props.elementType}`} className={style.visitSelectorButton}>
                                {new Date(parseInt(visit.visitDate, 10)).toDateString()}
                            </Link><br /><br />
                        </React.Fragment>
                    ))
                    : null}
            </div>
        );
    }
}