import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './patientProfile.module.css';

@connect(state => ({
    visitList: state.patientProfile.data.visits,
    patientId: state.patientProfile.data.patientId
}))
export class VisitPicker extends Component {
    render() {
        if (this.props.visitList && this.props.visitList.length > 0) {
            // TODO Address this question of shadowVisit soon !
            let list = this.props.visitList.filter(visit => visit.type === 1);
            return (
                <div>
                    {list.length > 0 ? (
                        <>
                            <span><i>If you are recording this {this.props.elementType} in the context of an inpatient visit please select which one below:</i></span><br /><br />
                            {list.map(visit => (
                                <React.Fragment key={visit.id}>
                                    <Link to={`/patientProfile/${this.props.patientId}/create/${visit.id}/${this.props.elementType}`} className={style.visitSelectorButton}>
                                        {new Date(parseInt(visit.visitDate, 10)).toDateString()}
                                    </Link><br /><br />
                                </React.Fragment>
                            ))}
                        </>
                    ) : null}
                </div>
            );
        } else
            return null;
    }
}