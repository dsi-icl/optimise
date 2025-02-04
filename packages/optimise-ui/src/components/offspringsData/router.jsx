import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { OffspringData } from './offspringDataPage';
import { OffspringsListingPage } from './offspringsListingPage';

export class OffspringsPageRouter extends Component {
    render() {
        /* delegating checking valid :elementType to a router rather than checking it in <DataTemplate/> through the match props
           keeping the logic of validating url in one place (routers) instead of in components */
        /* different elementType passed to dataTemplate makes it look in different places in the store */
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/pregnancy/:pregnancyId/offsprings' render={({ match }) => <OffspringsListingPage elementType='clinicalEvent' match={match} />} />
                <Route path='/patientProfile/:patientId/offsprings/:offspringId' render={({ match }) => <OffspringData elementType='clinicalEvent' match={match} />} />
                <Route path='/patientProfile/:patientId/offsprings' render={({ match }) => <OffspringsListingPage elementType='clinicalEvent' match={match} />} />
                <Route path='/' component={() => null} />
            </Switch>
        );
    }
}