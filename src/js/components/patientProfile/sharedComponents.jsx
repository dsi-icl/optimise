import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddVisitIcon, AddTestIcon, AddTreatmentIcon, AddEventIcon } from '../../../statics/svg/icons.jsx';
import { NavLink } from 'react-router-dom';
import { VisitPicker } from './popup.jsx';
import cssButtons from '../../../css/buttons.module.css';
import cssDropdowns from '../../../css/dropdowns.module.css';
import cssSectioning from '../../../css/sectioning.module.css';
import cssTexts from '../../../css/inlinetexts.module.css';

export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <div>
                <div className={cssSectioning.sectionTitleBar}>{this.props.sectionName.toUpperCase()}
                    {this.props.titleButton ? this.props.titleButton : null}
                </div>
                <div className={cssSectioning.sectionBody} style={this.props.bodyStyle ? this.props.bodyStyle : null}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

@connect(state => ({ patientId: state.patientProfile.data.patientId }))
export class PatientProfileTop extends Component {
    render() {
        return (
            <div style={{ position: 'relative' }}>
                <span>{this.props.image}<h1 className={cssTexts.patientID}> Patient ID: <b>{this.props.patientId}</b></h1></span>
                <br /><span className={cssTexts.consentText}>This patient consents to have their data recorded for clinical trial purposes.</span>
                <div style={{ position: 'absolute', right: '1.7em', top: '0.5em' }}>
                    <NavLink to={`/patientProfile/${this.props.patientId}/createVisit`} style={{ textDecoration: 'none' }}>
                        <div title='Create visit' className={[cssButtons.patientBanner, cssButtons.userActionButton].join(' ')} style={{ marginRight: 5 }}><AddVisitIcon width='1.3em' /></div>
                    </NavLink>
                    <div title='Order test' className={[cssDropdowns.dropDownMenu, cssButtons.patientBanner, cssButtons.userActionButton].join(' ')} style={{ borderRadius: '6px 0 0 6px' }}><AddTestIcon width='1.2em' /><VisitPicker elementType='test' /></div>
                    <div title='Add prescription' className={[cssDropdowns.dropDownMenu, cssButtons.patientBanner, cssButtons.userActionButton].join(' ')} style={{ borderRadius: 0 }}><AddTreatmentIcon width='1.3em' /><VisitPicker elementType='treatment' /></div>
                    <div title='Record event' className={[cssDropdowns.dropDownMenu, cssButtons.patientBanner, cssButtons.userActionButton].join(' ')} style={{ borderRadius: '0 6px 6px 0' }}><AddEventIcon width='1.2em' /><VisitPicker elementType='clinicalEvent' /></div>
                </div>
            </div>
        );
    }
}

