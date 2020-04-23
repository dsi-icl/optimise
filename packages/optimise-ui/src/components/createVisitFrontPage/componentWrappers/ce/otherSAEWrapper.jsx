import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';
import { EventCreatedMessage, RenderEventsWrapper, EditEventDataWrapper, CreateEventWrapper, EditEventWrapper } from './common';
import style from '../../frontpage.module.css';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    typeHash: state.availableFields.clinicalEventTypes_Hash[0],
    meddraHash: state.availableFields.meddra_Hash[0]
}))
export class OtherSAEWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no'
                render={({ match, location }) =>
                    <>
                        <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>
                        <FrontPageNavigationButton match={match} location={location}/>
                    </>
                }
            />
            <Route render={({ match, location }) =>
                <>
                    <div className={style.page}>
                        <div className={scaffold_style.wrapper}>
                            <div className={scaffold_style.create_element_panel}>
                                <Switch>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' render={({ match, location }) => <EditEventWrapper title={'Edit this event'} match={match} location={location}/>}/>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:ceId' render={({ match, location }) => <EventCreatedMessage location={location} match={match} events={this.props.data.clinicalEvents} typeHash={this.props.typeHash} meddraHash={this.props.meddraHash}/>}/>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <CreateEventWrapper title={'Record a new adverse event'} fixedCeTypes={[3,5,6]} match={match} location={location}/>}/>
                                </Switch>
                            </div>
                            <div className={scaffold_style.list_element_panel}>
                                <Switch>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:ceId' render={({ match, location }) => <EditEventDataWrapper location={location} match={match}/>}/>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' render={({ match, location }) => <RenderEventsWrapper title={'Here is a list of SAEs of this patient:'} displayTheseTypes={[3,5,6]} match={match} location={location} events={this.props.data.clinicalEvents} baselineVisit={true} />}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <FrontPageNavigationButton match={match} location={location}/>
                </>
            }/>
        </Switch>;
    }
}
