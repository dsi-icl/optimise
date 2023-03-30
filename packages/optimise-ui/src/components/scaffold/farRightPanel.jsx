import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreatePatient } from '../createPatient';
import { Section } from '../patientProfile/patientProfile';
import { DataPageRouter } from '../medicalData/router';
import { CreateVisit } from '../createMedicalElements/createVisit';
import { CreateElementRouter } from '../createMedicalElements/router';
import { EditElementRouter } from '../editMedicalElements/router';
import { ExportSets } from '../exportCDSIC/exportSet';
import { DeletedPatient } from '../patientProfile/deletedProfile';
import { UserCreate } from '../admin/userCreatePage';
import { UserDetail } from '../admin/userDetailPage';
import { UserActions } from '../admin/userActions';
import { UserManualMenu } from '../userManual';
import style from './scaffold.module.css';

export default class FarRightPanel extends Component {
    render() {
        return (
            <div className={style.farRightPanel}>
                <Routes>
                    <Route path='/patientProfile/:patientId/create/:type' element={<CreateElementRouter />} />
                    <Route path='/patientProfile/:patientId/edit/:elementType/:elementId' element={<EditElementRouter />} />
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' element={<DataPageRouter />} />
                    <Route path='/patientProfile/:patientId/createVisit' element={<CreateVisit />} />
                    <Route path='/patientProfile/:patientId' element={<Section />} />
                    <Route path='/searchPatient/from/deletionSuccessful' element={<DeletedPatient />} />
                    <Route path='/createPatient/:patientIdCreated' element={<CreatePatient />} />
                    <Route path='/createPatient/' element={<CreatePatient />} />
                    <Route path='/filterPatients' element={<></>} />
                    <Route path='/administration/users/create' element={<UserCreate />} />
                    <Route path='/administration/users/:userId' element={<UserDetail />} />
                    <Route path='/administration/users' element={<UserActions />} />
                    <Route path='/administration' element={<></>} />
                    <Route path='/userManual' element={ <UserManualMenu />} />
                    <Route path='/' element={<ExportSets />} />
                </Routes>
            </div>
        );
    }
}
