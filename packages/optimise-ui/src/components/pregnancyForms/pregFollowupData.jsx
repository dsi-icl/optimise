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
            <label>Prenatal imaging: <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} /></label><br/><br/>

            <label>Pregnancy outcome<br/>
            <select value={this.state.ART}>
            <option value='ongoing'>None</option>
            <option value='term_delivery_healthy'>Term delivery healthy (&gt; 37 weeks)</option>
            <option value='preterm_delivery_healthy'>Pre-term delivery healthy (&lt; 37 weeks)</option>
            <option value='term_delivery_with_congenital_abnormality'>Term delivery with congenital abnormality (37 weeks)</option>
            <option value='preterm_delivery_with_congenital_abnormality'>Pre-Term delivery with congenital abnormality (37 weeks)</option>
            <option value='miscarrage_lt_20weeks'>Miscarriage (20weeks)</option>
            <option value='miscarrage_gt_20weeks'>Miscarriages (20weeks)</option>
            <option value='ectopic'>Ectopic Pregnancy</option>
            <option value='elective_termination'>Elective Termination</option>
            <option value='Neonatal death'>Neonatal death</option>
            </select>
            </label><br/><br/>

            <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} /></label><br/><br/>

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
