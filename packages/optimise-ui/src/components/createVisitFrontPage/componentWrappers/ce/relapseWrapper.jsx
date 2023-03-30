import React, { Component } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';
import { connect } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import style from '../../frontpage.module.css';
import { EventCreatedMessage, RenderEventsWrapper, EditEventDataWrapper, CreateEventWrapper, EditEventWrapper } from './common';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

// @withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    typeHash: state.availableFields.clinicalEventTypes_Hash[0],
    meddraHash: state.availableFields.meddra_Hash[0]
}))
export class RelapseWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion}/>} />
            <div className={style.page}>
                <div className={scaffold_style.wrapper}>
                    <div className={scaffold_style.create_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' element={<EditEventWrapper title={'Edit this relapse'} location={useLocation()}/>}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:ceId' element={<EventCreatedMessage location={useLocation()} events={this.props.data.clinicalEvents} typeHash={this.props.typeHash} meddraHash={this.props.meddraHash}/>}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={<CreateEventWrapper title={'Record a relapse'} fixedCeTypes={[1]} location={useLocation()}/>}/>
                        </Routes>
                    </div>
                    <div className={scaffold_style.list_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:ceId' element={<EditEventDataWrapper location={useLocation()} />}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/' element={<RenderEventsWrapper title={'Here is a list of relapses of this patient:'} displayTheseTypes={[1]} location={useLocation()} events={this.props.data.clinicalEvents} baselineVisit={true} />}/>
                        </Routes>
                    </div>
                </div>
            </div>
            <FrontPageNavigationButton location={useLocation()}/>
        </>;
    }
}
