import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { VisitPicker } from './popup';
import Icon from '../icon';
import cssDropdowns from '../../../css/dropdowns.module.css';
import cssSectioning from '../../../css/sectioning.module.css';
import cssTexts from '../../../css/inlinetexts.module.css';

export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <>
                <div className={cssSectioning.sectionTitleBar}>{this.props.sectionName.toUpperCase()}
                    {this.props.titleButton ? this.props.titleButton : null}
                </div>
                <div className={cssSectioning.sectionBody} >
                    {this.props.children}
                </div>
            </>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
export class PatientProfileTop extends Component {
    render() {
        const { patientId, consent } = this.props.data;
        return (
            <>
                <span>{this.props.image}<h1 className={cssTexts.patientID}> Patient ID: <b>{patientId}</b></h1></span>
                <br /><span className={cssTexts.consentText}>{`This patient ${consent ? 'consents' : 'does NOT consent'} to have their data shared for research purposes.`}</span>
                <div >
                    <NavLink to={`/patientProfile/${patientId}/createVisit`} >
                        <div title='Create visit' ><Icon symbol='addVisit' /></div>
                    </NavLink>
                    <div title='Order test' className={[cssDropdowns.dropDownMenu]} ><Icon symbol='addTest' /><VisitPicker elementType='test' /></div>
                    <div title='Add prescription' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addTreatment' /><VisitPicker elementType='treatment' /></div>
                    <div title='Record event' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addEvent' /><VisitPicker elementType='clinicalEvent' /></div>
                </div>
            </>
        );
    }
}

