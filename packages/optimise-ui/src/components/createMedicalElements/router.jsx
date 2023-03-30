import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateTest } from './createTest';
import { CreateCE } from './createCE';
import { CreateTreatment } from './createTreatment';

export class CreateElementRouter extends Component {
    render() {
        return (
            <Routes>
                <Route path='/patientProfile/:patientId/create/test' element={<CreateTest />} />
                <Route path='/patientProfile/:patientId/create/clinicalEvent' element={<CreateCE />} />
                <Route path='/patientProfile/:patientId/create/treatment' element={<CreateTreatment />} />
                <Route path='/' element={<></>} />
            </Routes>
        );
    }
}