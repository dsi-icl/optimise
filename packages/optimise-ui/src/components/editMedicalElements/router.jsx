import React, { Component } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { EditVisit, EditTest, EditCE, EditMed, EditDemo, EditDiagnoses, EditPregnancies, EditCommunication, EditPerformanceMesaure, EditComorbidities } from './index';
import EditConcomitantMeds from './createConmitantMeds';

export class EditElementRouter extends Component {
    element() {
        return (
            <Routes>
                <Route path='/patientProfile/:patientId/edit/visit/:visitId' element={<EditVisit location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/comorbidity/:visitId' element={<EditComorbidities location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/concomitantMed/:visitId' element={<EditConcomitantMeds location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/test/:elementId' element={<EditTest location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/clinicalEvent/:elementId' element={<EditCE location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/treatment/:elementId' element={<EditMed location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/demographic/data' element={<EditDemo location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/diagnosis/data' element={<EditDiagnoses location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/pregnancy/data' element={<EditPregnancies location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/communication/:visitId' element={<EditCommunication location={useLocation()} />} />
                <Route path='/patientProfile/:patientId/edit/msPerfMeas/:visitId' element={<EditPerformanceMesaure location={useLocation()} />} />
                <Route path='/' element={<></>} />
            </Routes>
        );
    }
}