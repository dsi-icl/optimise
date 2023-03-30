import React, { Component } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { PatientChart } from '../patientProfile/patientChart';
import { PatientDispatch } from '../patientProfile/patientDispatch';
import { SearchPatient } from '../searchPatient';
import { UserManual } from '../userManual';
import { AdminActions } from '../admin/actions';
import { FilterPanel } from '../filterPatient/selectPanel';
import style from './scaffold.module.css';

export default class RightPanel extends Component {
    render() {
        return (
            <div className={style.rightPanel}>
                <Routes>
                    <Route path='/administration' element={<AdminActions location={useLocation().pathname} />} />
                    <Route path='/createPatient' element={<SearchPatient />} />
                    <Route path='/patientProfile/:patientId' element={<PatientChart location={useLocation().pathname} />} />
                    <Route path='/patientProfile' element={<PatientDispatch />} />
                    <Route path='/filterPatients' element={<FilterPanel />} />
                    <Route path='/userManual' element={<UserManual />} />
                    <Route path='/' element={<SearchPatient />} />
                </Routes>
            </div>
        );
    }
}
