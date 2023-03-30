import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditComorbidity from '../../../editMedicalElements/editComorbidity';
import { Route, Routes, useLocation } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

let TempComponent = () =>
    <>
        <div className={scaffold_style.padding_div}>
            <p>Please record all comorbidities for this visit:</p>
            <EditComorbidity location={useLocation()} override_style={override_style}/>
        </div>
        <FrontPageNavigationButton location={useLocation()}/>
    </>;

export class ComorbidityWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Routes>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion} />} />
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={<TempComponent />} />
        </Routes>;
    }
}