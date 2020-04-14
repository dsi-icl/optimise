import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { RenderTestWrapper } from './common';
import { EditTestDataWrapper } from './common';
import { CreateTestWrapper } from './common';
import { EditTestWrapper } from './common';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class TestWrapper extends Component {
    render() {
        return <Switch>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={'Any lab tests?'}/>}/>
            <Route render={() =>
                <div className={scaffold_style.wrapper}>
                    <div className={scaffold_style.create_element_panel}>
                        <Switch>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' render={({ match, location }) => <EditTestWrapper title={'Edit this lab test'} match={match} location={location}/>}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match, location }) => <LabTestCreatedMessage match={match} location={location} tests={this.props.data.tests}/>}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <CreateTestWrapper title={'Record a lab test result'} fixedTestType={1} match={match} location={location}/>}/>
                        </Switch>
                    </div>
                    <div className={scaffold_style.list_element_panel}>
                        <Switch>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match, location }) => <EditTestDataWrapper location={location} match={match}/>}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <RenderTestWrapper title={'Here are all the lab results for this patient:'} location={location} match={match} displayThisType={1} tests={this.props.data.tests} />}/>
                        </Switch>
                    </div>
                </div>
            }/>
        </Switch>;
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
                <p>Please enter lab results on the opposite panel for the following test:</p>
                <br/>
                <p><b>Date:</b> {dateOccur}</p>

                <br/><br/>
                <p>You can also record another lab test (only record another test if it is from a different date):</p>
                <br/>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}${this.props.location.search}`}> <button>Create another test</button></NavLink>
            </div>
        );
    }
}