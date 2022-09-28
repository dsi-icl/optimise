import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BaselineVisitFrontPage } from './templates/baselineVisitFrontPage';
import { FollowupVisitFrontPage } from './templates/followupVisitFrontPage';

@connect(state => ({
    patientProfile: state.patientProfile.data,
    sections: state.availableFields.visitSections
    }))
export class FrontPage extends Component {
    render() {
        const { match, patientProfile: { visits }, location } = this.props;
        if (visits === undefined)
            return null;

        const number_of_routine_visits = this.props.patientProfile.visits.filter(visit => visit.type === 1);
        if (number_of_routine_visits.length === 1) {
            return <BaselineVisitFrontPage match={match} location={location}/>;
        } else if (number_of_routine_visits.length > 1) {
            return <FollowupVisitFrontPage match={match} location={location}/>;
        } else {
            return <p>Something went wrong.</p>;
        }
    }
}