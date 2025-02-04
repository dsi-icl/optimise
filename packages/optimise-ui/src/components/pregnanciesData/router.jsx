import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PregnancyData } from './pregnancyDataPage';
import { PregnanciesListingPage } from './pregnanciesListingPage';
import { OffspringsListingPage } from '../offspringsData/offspringsListingPage';

export class PregnancyPageRouter extends Component {
    render() {
        /* delegating checking valid :elementType to a router rather than checking it in <DataTemplate/> through the match props
           keeping the logic of validating url in one place (routers) instead of in components */
        /* different elementType passed to dataTemplate makes it look in different places in the store */
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/pregnancy/:pregnancyId/offsprings' render={({ match }) => <OffspringsListingPage elementType='clinicalEvent' match={match} />} />
                <Route path='/patientProfile/:patientId/pregnancy/:pregnancyId' render={({ match }) => <PregnancyData elementType='clinicalEvent' match={match} />} />
                <Route path='/patientProfile/:patientId/pregnancy' render={({ match }) => <PregnanciesListingPage elementType='clinicalEvent' match={match} />} />
                <Route path='/' component={() => null} />
            </Switch>
        );
    }
}