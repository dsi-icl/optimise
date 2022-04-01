import React, { Component, PureComponent } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import style from '../../frontpage.module.css';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';
import { PregnancyList } from '../../../pregnancyForms/pregnancyList';
import { EditPregnancies } from '../../../pregnancyForms/editPregnancy';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    drugHash: state.availableFields.drugs_Hash[0]
}))
export class PregnancyWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no'
                render={({ match, location }) => <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>}
            />
            <Route render={({ match, location }) =>
                <>
                    <div className={style.page}>
                        <div className={scaffold_style.wrapper + ' ' + scaffold_style.wrapper_pregnancy}>
                            <div className={scaffold_style.create_element_panel}>
                                <Switch>
                                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <PregnancyList renderedInFrontPage={true}/>}/>
                                </Switch>
                            </div>
                            <div className={scaffold_style.list_element_panel}>
                                <Switch>
                                    <Route exact path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => null }/>
                                    <Route exact path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:entryId' render={({ match, location }) => <EditPregnancies match={match} location={location} renderedInFrontPage={true}/>}/>
                                    <Route exact path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/add/:type/:pregnancyId' render={({ match, location }) => <EditPregnancies  match={match} location={location} renderedInFrontPage={true}/>}/>
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