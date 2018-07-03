import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, NavLink } from 'react-router-dom';
import { CreateTest } from './createTest.jsx';

export class CreateElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/create/:visitId/test' render={({ match }) => <CreateTest match={match}/>}/>
                <Route path='/patientProfile/:patientId/create/:visitId/clinicalEvent' render={({ match }) => <CreateElementRouter match={match}/>}/>
                <Route path='/patientProfile/:patientId/create/:visitId/treatment' render={({ match }) => <CreateElementRouter match={match}/>}/>
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>}/>
            </Switch>
        )
    }
}