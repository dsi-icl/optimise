import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import EditCommunication from '../../../editMedicalElements/editCommunication';
// import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import style from '../../frontpage.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';


let TempComponent = () =>
    <>
        <div className={style.page}>
            <div className={scaffold_style.padding_div}>
                <h3>Communication and notes</h3>
                <EditCommunication location={ useLocation() } override_style={override_style}/>
            </div>
        </div>
        <FrontPageNavigationButton location={ useLocation() } />
    </>;

export class CommunicationWrapper extends Component {

    render() {
        return <Routes>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={ <TempComponent />} />
        </Routes>;
    }
}