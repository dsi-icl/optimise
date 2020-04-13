import React, { Component, PureComponent } from 'react';
import override_style from './overrideStyle.module.css';
import scaffold_style from './scaffoldStyle.module.css';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CreateTest } from '../../../createMedicalElements/createTest';
import { TestData } from '../../../medicalData/testDataPage';
import { Test } from '../../../patientProfile/patientChart';
import { RenderTestWrapper } from './common';
import { EditTestDataWrapper } from './common';
import { CreateTestWrapper } from './common';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class MRIWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match }) => <LabTestCreatedMessage match={match}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <CreateTestWrapper fixedTestType={3} match={match} location={location}/>}/>
                </Switch>
            </div>
            <div className={scaffold_style.list_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' render={({ match }) => <EditTestDataWrapper match={match}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <RenderTestWrapper match={match} location={location} displayThisType={3} tests={this.props.data.tests} />}/>
                </Switch>
            </div>
        </div>;
    }
}

class LabTestCreatedMessage extends Component {
    render() {
        const { patientId, visitId, currentPage } = this.props.match.params;
        return (
            <div>
                <p>Lab test has been created! Please enter lab results on the opposite panel.</p>

                <p>You can also create another lab test (only create another test if it is from a different date):</p>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}`}> <button>Create another test</button></NavLink>
            </div>
        );
    }
}