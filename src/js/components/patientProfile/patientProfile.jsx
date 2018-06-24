import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from '../../../css/patientProfile.css.js';
import saveIcon from '../../../statics/icons/icons8-tick-box-48.png';
import { UserActions } from './userActions.jsx';
import { CheckIcon, AddVisitIcon } from '../../../statics/svg/icons.jsx';

@connect(state => ({ fetching: state.patientProfile.fetching }))
export class Section extends Component {
    render() {
        if (this.props.fetching) {
            return <span> FETCHING PROFILE </span>
        } else {
            return (<div style={css.bigWrapper}>     
                <UserActions/> <br/> <br/>      
                <DemographicSection/>
                <ImmunisationSection/>
                <MedicalHistorySection/>
            </div>)
        }
    }
}


export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <div>
                <div style={css.sectionTitleBar}>{this.props.sectionName.toUpperCase()}
                    {this.props.titleButton ? this.props.titleButton : null}
                </div>
                <div style={this.props.suppressSectionBodyCss ? this.props.bodyStyle : css.sectionBody}>
                    {this.props.children}
                </div>
                <div className='checkMark' style={{ width: '1.5em' }}><CheckIcon/></div>
            </div>
        );
    }
}

class SaveButton extends Component {
    render(){
        const style = { width: 40, cursor: 'pointer' };
        return <img style={style} src={saveIcon} alt='save'/>
    }
}


@connect(state => ({ patientId: state.patientProfile.data.patientId }))
export class PatientProfileTop extends Component {
    render(){
        return (
            <div style={{ marginBottom: 20 }}>
                <span>{this.props.image}<h1 style={{ display: 'inline' }}> Patient ID: <b>{this.props.patientId}</b></h1></span>
            </div>
        );
    }
}

@connect(state => ({ demographicData: state.patientProfile.data.demographicData }))
class DemographicSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Profile'>
                {Object.entries(this.props.demographicData).map(el => <span key={el[0]}><b>{`${el[0].replace(/_/g, ' ')  }: `}</b>{el[1]}<br/></span>)}
            </PatientProfileSectionScaffold>
        );
    }
}

@connect(state => ({ immunisations: state.patientProfile.data.immunisations }))
class ImmunisationSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                coming
            </PatientProfileSectionScaffold>
        );
    }
}


@connect(state => ({ medicalHistory: state.patientProfile.data.medicalHistory }))
class MedicalHistorySection extends Component {
    render() {
        return (
            <div>
                <PatientProfileSectionScaffold sectionName='Existing Medical Conditions'>
                coming
                </PatientProfileSectionScaffold>
                <PatientProfileSectionScaffold sectionName='Family Medical History'>
                coming
                </PatientProfileSectionScaffold>
            </div>
        );
    }
}