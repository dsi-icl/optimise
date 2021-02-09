import React, { Component } from 'react';
//import { connect } from 'react-redux';
//import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
//import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';


//function mapStateToProps(state) {
//    return {
//        fields: state.availableFields,
//        patientProfile: state.patientProfile
//    };
//}
//
//@withRouter
//@connect(mapStateToProps)
export class PregnancyBaselineDataForm extends Component {
    constructor() {
        super();
        this.state = {
            LMP: moment(), //last menstrual period
            maternalAgeAtLMP: undefined,
            maternalBMI: undefined,
            EDD: moment(), //estimated delivery date
            PNI_date: moment(), //prenatal imaging date
            ART: 'none', //assisted reproductive technology method
            numOfFoetuses: undefined, //number of foetuses
            folicAcidSuppUsed: false, //folic acid supplementation used
            folicAcidSuppUsedStartDate: moment(), //if so, folic acid supplementation start date
            illicitDrugUse: false,
        };
        this.originalValues = {};
    }

    //static getDerivedStateFromProps(props, state) {
    //    if (props.match.params.ceId === state.ceId)
    //        return state;
    //    return {
    //        ...state,
    //        ceId: props.match.params.ceId,
    //        refreshReferences: true
    //    };
    //}
    //
    //componentDidUpdate() {
    //    if (this.state.refreshReferences === true) {
    //        this.references = null;
    //        this.setState({
    //            refreshReferences: false
    //        });
    //    }
    //}

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: false
        });
    }

    render() {
        return (<form>
            <label>Date of last menstrual period (LMP): <PickDate startDate={this.state.LMP} handleChange={this._handleDateChange} /></label><br/><br/>
            <label>Maternal age at LMP: <input value={this.state.maternalAgeAtLMP}/></label><br/><br/>
            <label>Maternal BMI: <input value={this.state.maternalBMI}/></label><br/><br/>
            <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} /></label><br/><br/>
            <label>Prenatal imaging: <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} /></label><br/><br/>
            <label>Assisted Reproductive Technology method:<br/>
            <select value={this.state.ART}>
            <option value='none'>None</option>
            <option value='ivf'>IVF</option>
            <option value='iui'>IUI</option>
            <option value='ovulation_drugs'>Ovulation Drugs</option>
            <option value='others'>Others</option>
            </select>
            </label><br/><br/>
            <label>Number of foetuses: <input value={this.state.numOfFoetuses}/></label><br/><br/>
            <label>Folic acid supplementation:
            <select value={this.state.folicAcidSuppUsed}>
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
            </select>
            </label><br/>
            {
                this.state.folicAcidSuppUsed ?
                <>
                <label>Folic acid supplementation start date:
                <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} />
                </label><br/><br/>
                </>
                :
                null
            }
            <label>Illicit drug use:
            <select value={this.state.illicitDrugUse}>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
            </select>
            </label><br/><br/>

            </form>);
    }
}
