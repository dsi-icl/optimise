import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditConcomitantMed from '../../../editMedicalElements/createConmitantMeds';
import { Route, Routes, useLocation } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import scaffold_style from '../scaffoldStyle.module.css';
import style from '../../frontpage.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

let TempComponent = () =>
    <>
        <div className={style.page}>
            <div className={scaffold_style.padding_div}>
                <p>All the concomitant medications or supplements this patient has been on will be shown here.</p>
                <EditConcomitantMed location={useLocation()} renderedInFrontPage={true} override_style={override_style}/>
            </div>
        </div>
        <FrontPageNavigationButton location={useLocation()}/>
    </>;

export class ConcomitantMedWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Routes>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion} />} />
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={ <TempComponent />} />
        </Routes>;
    }
}