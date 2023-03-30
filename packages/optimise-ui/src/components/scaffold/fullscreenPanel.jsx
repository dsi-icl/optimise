import React, { Component } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import FullTimeline from '../patientProfile/fullTimeline';
import EDSSCalculator from '../EDSScalculator/calculator';
import style from './scaffold.module.css';
import { FrontPage } from '../createVisitFrontPage/frontPageWrapper';
import { RemoteControl } from '../remoteControl/remoteControl';

export default class FullscreenPanel extends Component {
    render() {
        return (
            <>
                <Routes>
                    <Route path='/patientProfile/:patientId/timeline' element={
                        <div className={style.fullscreenPanel}>
                            <FullTimeline />
                        </div>
                    } />
                    <Route path='/patientProfile/:patientId/edit/msPerfMeas/:visitId/edss' element={
                        <div className={style.fullscreenPanel}>
                            <EDSSCalculator location={useLocation()} />
                        </div>
                    } />
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={
                        <div className={style.fullscreenPanel}>
                            <FrontPage location={useLocation()}/>
                        </div>
                    } />
                    <Route path='/remoteControl' element={
                        <div className={style.fullscreenPanel}>
                            <RemoteControl />
                        </div>
                    } />
                    <Route path='/' element={<></>} />
                </Routes>
            </>
        );
    }
}
