import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { RenderTestWrapper } from './common';
import style from '../../frontpage.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';
import { EditTestDataWrapper } from './common';
import { CreateTestWrapper } from './common';
import { EditTestWrapper } from './common';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';


@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))

export class TestWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion}/>} />
            <div className={style.page}>
                <div className={scaffold_style.wrapper}>
                    <div className={scaffold_style.create_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' element={<EditTestWrapper title={'Edit this lab test'} location={useLocation()}/>} />
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' element={<LabTestCreatedMessage location={useLocation()} tests={this.props.data.tests}/>} />
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' element={<CreateTestWrapper title={'Record a lab test result'} fixedTestType={1} location={useLocation()}/>} />
                        </Routes>
                    </div>
                    <div className={scaffold_style.list_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:testId' element={<EditTestDataWrapper location={useLocation()} />} />
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' element={<RenderTestWrapper title={'Here are all the lab results for this patient:'} location={useLocation()} displayThisType={1} tests={this.props.data.tests} />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <FrontPageNavigationButton location={useLocation()}/>
        </>;
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