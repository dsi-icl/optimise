import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TreatmentInterruption } from './treatmentInterruptions';
import { VisitData } from './visitDataPage';
import { TestData } from './testDataPage';
import { CeData } from './ceDataPage';

export class DataPageRouter extends Component {
    render() {
        /* delegating checking valid :elementType to a router rather than checking it in <DataTemplate/> through the match props
           keeping the logic of validating url in one place (routers) instead of in components */
        /* different elementType passed to dataTemplate makes it look in different places in the store */
        return (
            <Routes>
                <Route path='/patientProfile/:patientId/data/test/:testId' element={ <TestData elementType='test' />} />
                <Route path='/patientProfile/:patientId/data/visit/:visitId/vitals' element={ <VisitData elementType='visit' category={'vitals'} />} />
                <Route path='/patientProfile/:patientId/data/visit/:visitId/symptoms' element={ <VisitData elementType='visit' category={'symptoms'} />} />
                <Route path='/patientProfile/:patientId/data/visit/:visitId/signs' element={ <VisitData elementType='visit' category={'signs'} />} />
                <Route path='/patientProfile/:patientId/data/treatment/:elementId' element={ <TreatmentInterruption />} />
                <Route path='/patientProfile/:patientId/data/clinicalEvent/:ceId' element={ <CeData elementType='clinicalEvent' />} />
                <Route path='/' element={<></>} />
            </Routes>
        );
    }ú
}