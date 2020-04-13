import React, { Component, PureComponent } from 'react';
import override_style from './overrideStyle.module.css';
import scaffold_style from './scaffoldStyle.module.css';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CreateTest } from '../../../createMedicalElements/createTest';
import { TestData } from '../../../medicalData/testDataPage';
import { Test } from '../../../patientProfile/patientChart';

export class RenderTestWrapper extends PureComponent {
    render() {
        const { tests: allTests, displayThisType } = this.props;

        const labtests = allTests.filter(el => el.type === displayThisType);

        if (labtests.length === 0) {
            return <p>Lab tests will be displayed here.</p>;
        }

        // const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <table className={override_style.treatment_table}>
            <thead>
                <tr><th></th><th>Type</th><th>Test date</th><th></th></tr>
            </thead>
            <tbody>
                {labtests.map(el => <Test key={el.id} data={el} renderedInFrontPage={true} match={this.props.match}/>)}
            </tbody>
        </table>;
    }
}

export class EditTestDataWrapper extends PureComponent {
    render() {
        return (
            <TestData match={this.props.match} override_style={override_style} location={this.props.location}/>
        );
    }
}

export class CreateTestWrapper extends Component {
    render() {
        const { fixedTestType } = this.props.fixedTestType
        /* <p>If you have to record lab results for liver function, anti-JCV antibodies or blood cell count, please enter test date and click "Create test".</p>  */
        return (
            <CreateTest match={this.props.match} fixedTestType={fixedTestType} override_style={override_style} renderedInFrontPage={true}/>
        );
    }
}
