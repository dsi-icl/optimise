import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { VisitPicker } from './popup';
import Icon from '../icon';
import cssDropdowns from '../../../css/dropdowns.module.css';

export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <>
                <h4>{this.props.sectionName}</h4><br />
                {this.props.children}<br /><br /><br />
            </>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
export class PatientProfileTop extends Component {
    render() {
        const { patientId } = this.props.data;
        return (
            <div >
                <NavLink to={`/patientProfile/${patientId}/createVisit`} >
                    <div title='Create visit' ><Icon symbol='addVisit' /></div>
                </NavLink>
                <div title='Order test' className={[cssDropdowns.dropDownMenu]} ><Icon symbol='addTest' /><VisitPicker elementType='test' /></div>
                <div title='Add prescription' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addTreatment' /><VisitPicker elementType='treatment' /></div>
                <div title='Record event' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addEvent' /><VisitPicker elementType='clinicalEvent' /></div>
            </div>
        );
    }
}

