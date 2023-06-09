import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';
import style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';


import { BackButton } from '../medicalData/utils';
import { Link } from 'react-router-dom';

import { createPregnancyDataAPICall, editPregnancyDataAPICall } from '../../redux/actions/demographicData';




//function mapStateToProps(state) {
//    return {
//        fields: state.availableFields,
//        patientProfile: state.patientProfile
//    };
//}
//
//@withRouter
//@connect(mapStateToProps)

@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class PregnancyBaselineDataForm extends Component {
    constructor(props) {
        super();
        const { childRef } = props;
        if (childRef) {
            childRef(this);
        }
        this.state = {
            dataType: 'baseline',
            showAddNewImageData: false,
            addNewImageData_counter: 1,
            addNewImageData_date: moment(),
            addNewImageData_mode: false,
            addNewImageData_result: false,
            addNewImageData_cache: [],
            LMP: moment(), //last menstrual period
            maternalAgeAtLMP: undefined,
            maternalBMI: undefined,
            EDD: moment(), //estimated delivery date
            ART: 'none', //assisted reproductive technology method
            numOfFoetuses: undefined, //number of foetuses
            folicAcidSuppUsed: false, //folic acid supplementation used
            folicAcidSuppUsedStartDate: moment(), //if so, folic acid supplementation start date
            illicitDrugUse: false,
            saved: false

        };

        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

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

    // _handleDateChange(date) {
    //     this.setState({
    //         startDate: date,
    //         error: false
    //     });
    // }

    _handleDateChange(date, field) {
        this.setState({
            [field]: date,
            error: false
        });
    }

    _handleInputChange(event, field) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [field]: value });
    }

    _handleSubmit(ev) {
        ev.preventDefault();

        console.log('pregBaselineData');

        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.props.formData) {
            return;
        }

        const body = {
            patientId: this.props.data.patientId,
            body: {
                id: this.props.formData.id,
                dataType: this.state.dataType,
                LMP: this.state.LMP,
                maternalAgeAtLMP: this.state.maternalAgeAtLMP,
                maternalBMI: this.state.maternalBMI,
                EDD: this.state.EDD,
                ART: this.state.ART,
                numOfFoetuses: this.state.numOfFoetuses,
                folicAcidSuppUsed: this.state.folicAcidSuppUsed,
                folicAcidSuppUsedStartDate: this.state.folicAcidSuppUsedStartDate,
                illicitDrugUse: this.state.illicitDrugUse,
            }

        };

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyDataAPICall(body));
            //this.setState({ addMore: false });
            this.setState({ saved: true })
        });
    }

    render() {
        return (<>
            {
                this.props.renderedInFrontPage ?
                    null :
                    <div className={style.ariane}>
                        <h2>Edit baseline record</h2>
                        {/* <BackButton to={`/patientProfile/${params.patientId}`} /> */}
                        <BackButton to={`/patientProfile/1`} />
                    </div>
            }
            <div
                className={this.props.renderedInFrontPage ? null : style.panel}
            >
                <label>Date of last menstrual period (LMP): <PickDate startDate={this.state.LMP} handleChange={(date) => this._handleDateChange(date, 'LMP')} /></label><br /><br />
                <label>Maternal age at LMP: <input defaultValue={this.state.maternalAgeAtLMP} onChange={(event) => this._handleInputChange(event, 'maternalAgeAtLMP')} /></label><br /><br />
                <label>Maternal BMI: <input defaultValue={this.state.maternalBMI} onChange={(event) => this._handleInputChange(event, 'maternalBMI')} /></label><br /><br />
                <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={(date) => this._handleDateChange(date, 'EDD')} /></label><br /><br />
                <label>Assisted Reproductive Technology method:<br />
                    <select defaultValue={this.state.ART} onChange={(event) =>
                        this.setState({ ART: event.target.value })
                    }>
                        <option value='none'>None</option>
                        <option value='ivf'>IVF</option>
                        <option value='iui'>IUI</option>
                        <option value='ovulation_drugs'>Ovulation Drugs</option>
                        <option value='others'>Others</option>
                    </select>
                </label><br /><br />
                <label>Number of foetuses: <input defaultValue={this.state.numOfFoetuses} onChange={(event) => this._handleInputChange(event, 'numOfFoetuses')} /></label><br /><br />
                <label>Folic acid supplementation:
                    <select defaultValue={this.state.folicAcidSuppUsed}
                        onChange={(event) =>
                            this.setState({ folicAcidSuppUsed: event.target.value })
                        }>
                        <option value='yes'>Yes</option>
                        <option value='no'>No</option>
                    </select>
                </label><br />
                {
                    this.state.folicAcidSuppUsed === 'yes' ?
                        <>
                            <label>Folic acid supplementation start date:
                                <PickDate startDate={this.state.EDD} handleChange={this._handleDateChange} />
                            </label><br /><br />
                        </>
                        :
                        null
                }
                <label>Illicit drug use:
                    <select defaultValue={this.state.illicitDrugUse}
                        onChange={(event) =>
                            this.setState({ illicitDrugUse: event.target.value === 'true' })
                        }>
                        <option value='true'>Yes</option>
                        <option value='false'>No</option>
                    </select>
                </label><br /><br />

                {/* <div className={pregnancy_style.pregnancy_image_div}><h4>Image data</h4>
                    {
                        this.state.addNewImageData_cache.map(el =>
                            <div key={el.id} className={pregnancy_style.one_tentative_image}>
                                <span onClick={() => this.setState({
                                    addNewImageData_cache: this.state.addNewImageData_cache.filter(ele => ele.id !== el.id)
                                })}>X</span>
                                <span>Date: {el.date.toISOString()}</span><br />
                                <span>Mode: {el.mode}</span><br />
                                <span>Result: {el.result}</span><br />
                            </div>)
                    }
                    {
                        this.state.showAddNewImageData ?
                            <div>
                                <label>Image date:<PickDate startDate={this.state.addNewImageData_date} handleChange={this._handleDateChange} /></label><br /><br />
                                <label>Mode:
                                    <select defaultValue={this.state.folicAcidSuppUsed}>
                                        <option value='yes'>Yes</option>
                                        <option value='no'>No</option>
                                    </select>
                                </label><br /><br />
                                <label>Result:
                                    <select defaultValue={this.state.folicAcidSuppUsed}>
                                        <option value='yes'>Yes</option>
                                        <option value='no'>No</option>
                                    </select>
                                </label>
                                <button
                                    onClick={() => {
                                        this.setState(oldState => ({
                                            addNewImageData_cache: oldState.addNewImageData_cache.concat({
                                                id: oldState.addNewImageData_counter,
                                                date: oldState.addNewImageData_date,
                                                mode: oldState.addNewImageData_mode,
                                                result: oldState.addNewImageData_result
                                            }),
                                            addNewImageData_counter: oldState.addNewImageData_counter + 1
                                        }));
                                    }
                                    }
                                >
                                    Confirm
                                </button>
                                <button onClick={() => this.setState({ showAddNewImageData: false })}>Cancel</button>
                            </div>
                            :
                            <button onClick={() => this.setState({ showAddNewImageData: true })}>Add new image data</button>
                    }
                </div> */}
                <br /><br />
                <Link to={'/patientProfile/1/editPregnancyDataEntry/1'} ><button type='submit'>View full pregnancy timeline</button></Link>
                <br /><br />

                {this.props.renderedInFrontPage ? null :
                    <button type='submit'>Save</button>
                }

            </div></>);
    }
}


export default PregnancyBaselineDataForm;