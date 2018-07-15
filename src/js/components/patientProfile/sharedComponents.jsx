import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { VisitPicker } from './popup';
import Icon from '../icon';
import { BackButton } from '../medicalData/dataPage';
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
            <div className='profileActions'>
                <Link title='Create visit' to={`/patientProfile/${patientId}/createVisit`} ><Icon symbol='addVisit' /></Link>
                <span title='Order test' className={[cssDropdowns.dropDownMenu]} ><Icon symbol='addTest' /><VisitPicker elementType='test' /></span>
                <span title='Add prescription' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addTreatment' /><VisitPicker elementType='treatment' /></span>
                <span title='Record event' className={[cssDropdowns.dropDownMenu].join(' ')} ><Icon symbol='addEvent' /><VisitPicker elementType='clinicalEvent' /></span>
                <BackButton to={'/searchPatient'} />
            </div>
        );
    }
}

