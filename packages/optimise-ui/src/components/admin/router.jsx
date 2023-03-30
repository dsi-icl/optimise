import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Log } from './log';
import { UserList } from './users';
import { SystemInfo } from './system';
import { Meddra } from './meddra';
import { Update } from './update';
import { Sync } from './sync';
import { PatientMappings } from './patientMappings';

export class AdminRouter extends Component {
    render() {
        return (
            <Routes>
                <Route path='/administration/log' element={<Log />} />
                <Route path='/administration/users/*' element={<UserList />} />
                <Route path='/administration/system' element={<SystemInfo />} />
                <Route path='/administration/meddra' element={ <Meddra />} />
                <Route path='/administration/update' element={<Update />} />
                <Route path='/administration/sync' element={<Sync />} />
                <Route path='/administration/patientMappings' element={<PatientMappings />} />
                <Route path='/' element={<></>} />
            </Routes>
        );
    }
}