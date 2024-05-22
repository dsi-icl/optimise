import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import style from '../../frontpage.module.css';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

import { PregnancyEntry } from '../../../pregnancyForms/pregnancyEntry';


@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    drugHash: state.availableFields.drugs_Hash[0]
}))
class PregnancyWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;

        return <Switch>
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no'
                render={({ match, location }) => <YesOrNo match={match} location={location} questionString={yesOrNoQuestion} />}
            />

            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) =>
                <>
                    <div className={style.page}>
                        <div className={scaffold_style.padding_div}>

                            <PregnancyEntry
                                childRef={component => { this.form = component; }}
                                match={match}
                                location={location}
                                renderedInFrontPage={true}
                            />

                        </div>
                    </div>
                    <FrontPageNavigationButton
                        onClickNext={(ev) => {
                            this.form._handleSubmit(ev);
                            this.forceUpdate();
                        }}
                        formSaved={() => this.form.state.saved}
                        match={match} location={location} />
                </>
            } />

        </Switch>;
    }
}

export default PregnancyWrapper;