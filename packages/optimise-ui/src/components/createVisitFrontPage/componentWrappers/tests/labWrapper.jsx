import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { RenderTestWrapper } from './common';
import { EditTestDataWrapper } from './common';
import { CreateTestWrapper } from './common';
import { EditTestWrapper } from './common';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class TestWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' render={({ match, location }) => <EditTestWrapper match={match} location={location}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match }) => <LabTestCreatedMessage match={match} tests={this.props.data.tests}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <CreateTestWrapper fixedTestType={1} match={match} location={location}/>}/>
                </Switch>
            </div>
            <div className={scaffold_style.list_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match }) => <EditTestDataWrapper match={match}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match }) => <RenderTestWrapper match={match} displayThisType={1} tests={this.props.data.tests} />}/>
                </Switch>
            </div>
        </div>;
    }
}

class LabTestCreatedMessage extends Component {
    render() {
        const { patientId, visitId, currentPage, testId } = this.props.match.params;
        const testsFiltered = this.props.tests.filter(el => el.id.toString() === testId);

        if (testsFiltered.length !== 1) {
            return <p>Error: Cannot find test.</p>;
        }

        const currentTest = testsFiltered[0];
        const dateOccur = new Date(parseInt(currentTest.expectedOccurDate)).toDateString();
        return (
            <div>
                <p>Please enter lab results on the opposite panel.</p>
                <p>{dateOccur}</p>

                <p>You can also create another lab test (only create another test if it is from a different date):</p>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}`}> <button>Create another test</button></NavLink>
            </div>
        );
    }
}