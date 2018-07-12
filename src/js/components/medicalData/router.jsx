import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { DataTemplate } from './dataPage.jsx';

export class DataPageRouter extends Component {
    render() {
        /* delegating checking valid :elementType to a router rather than checking it in <DataTemplate/> through the match props
           keeping the logic of validating url in one place (routers) instead of in components */
        /* different elementType passed to dataTemplate makes it look in different places in the store */
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/data/test/:elementId' render={({ match }) => <DataTemplate elementType='test' match={match} />} />
                <Route path='/patientProfile/:patientId/data/visit/:elementId' render={({ match }) => <DataTemplate elementType='visit' match={match} />} />
                <Route path='/patientProfile/:patientId/data/treatment/:elementId' render={({ match }) => <DataTemplate elementType='treatment' match={match} />} />
                <Route path='/patientProfile/:patientId/data/clinicalEvent/:elementId' render={({ match }) => <DataTemplate elementType='clinicalEvent' match={match} />} />
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>} />
            </Switch>
        );
    }
}