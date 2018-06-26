import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddVisitIcon, AddTestIcon, AddTreatmentIcon, AddEventIcon } from '../../../statics/svg/icons.jsx';
import css from '../../../css/patientProfile.css.js';
import { NavLink } from 'react-router-dom';

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
            </div>
        );
    }
}

@connect(state => ({ patientId: state.patientProfile.data.patientId }))
export class PatientProfileTop extends Component {
    render(){
        return (
            <div style={{ position: 'relative' }}>
                <span>{this.props.image}<h1 style={{ display: 'inline-block', fontSize: '1.5rem', position: 'relative', top: '1rem' }}> Patient ID: <b>{this.props.patientId}</b></h1></span>
                <div style={{ position: 'absolute', right: '2em' }}>
                    <NavLink to={`${window.location.pathname}/createVisit`} style={{ textDecoration: 'none' }}>
                        <div class='patientBanner UserActionButton' style={{ borderRadius: 5, width: '1.7em', height: '2em', float: 'left', position: 'relative', right: 10 }}><AddVisitIcon width='1.7em'/></div>
                    </NavLink>
                    <div class='patientBanner UserActionButton' style={{ borderRadius: '5px 0 0 5px', width: '1.7em', height: '2em', float: 'left' }}><AddTestIcon width='1.7em'/></div>
                    <div class='patientBanner UserActionButton' style={{ width: '1.7em', height: '2em', float: 'left' }}><AddTreatmentIcon width='1.7em'/></div>
                    <div class='patientBanner UserActionButton' style={{ borderRadius: '0 5px 5px 0', width: '1.7em', height: '2em', float: 'left' }}><AddEventIcon width='0.6em' style={{ height: '1.7em' }}/></div>
                </div>
            </div>
        );
    }
}

