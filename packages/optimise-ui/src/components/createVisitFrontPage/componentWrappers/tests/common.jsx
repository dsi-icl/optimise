import React, { Component, PureComponent } from 'react';
import override_style from '../overrideStyle.module.css';
import { CreateTest } from '../../../createMedicalElements/createTest';
import { TestData } from '../../../medicalData/testDataPage';
import { Test } from '../../../patientProfile/patientChart';
import EditTest from '../../../editMedicalElements/editTest';

export class RenderTestWrapper extends PureComponent {
    render() {
        const { tests: allTests, displayThisType, match, title } = this.props;

        const labtests = allTests.filter(el => el.type === displayThisType);

        if (labtests.length === 0) {
            return <p>Lab tests will be displayed here.</p>;
        }

        // const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <>
            <p>{title}</p>
            <table className={override_style.treatment_table}>
                <thead>
                    <tr><th></th><th>Type</th><th>Test date</th><th></th></tr>
                </thead>
                <tbody>
                    {labtests.map(el => <Test key={el.id} data={el} renderedInFrontPage={true} match={match}/>)}
                </tbody>
            </table>
        </>;
    }
}

export class EditTestDataWrapper extends PureComponent {
    render() {
        return (
            <>
                <h3>Enter result:</h3>
                <TestData match={this.props.match} override_style={override_style} location={this.props.location}/>
            </>
        );
    }
}

export class CreateTestWrapper extends Component {
    render() {
        const { fixedTestType, match, location, title } = this.props;
        /* <p>If you have to record lab results for liver function, anti-JCV antibodies or blood cell count, please enter test date and click "Create test".</p>  */
        return (
            <>
                <h3>{title}</h3>
                <CreateTest match={match} location={location} fixedTestType={fixedTestType} override_style={override_style} renderedInFrontPage={true}/>
            </>
        );
    }
}

export class EditTestWrapper extends Component {
    render() {
        const { match, location, title } = this.props;
        return <>
            <h3>{title}</h3>
            <EditTest match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>
        </>;
    }
}
