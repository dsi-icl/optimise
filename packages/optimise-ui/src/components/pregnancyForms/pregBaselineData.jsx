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
import style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';

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
        };
        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
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
            error: false,
        });
    }

    render() {
        return (
            <>
                {this.props.renderedInFrontPage ? null : (
                    <div className={style.ariane}>
                        <h2>Edit baseline record</h2>
                    </div>
                )}
                <div className={style.panel}>
                    <label>
                        Date of last menstrual period (LMP):{' '}
                        <PickDate
                            startDate={this.state.LMP}
                            handleChange={this._handleDateChange}
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Maternal age at LMP:{' '}
                        <input value={this.state.maternalAgeAtLMP} />
                    </label>
                    <br />
                    <br />
                    <label>
                        Maternal BMI: <input value={this.state.maternalBMI} />
                    </label>
                    <br />
                    <br />
                    <label>
                        Estimated date of delivery:{' '}
                        <PickDate
                            startDate={this.state.EDD}
                            handleChange={this._handleDateChange}
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Assisted Reproductive Technology method:
                        <br />
                        <select value={this.state.ART}>
                            <option value="none">None</option>
                            <option value="ivf">IVF</option>
                            <option value="iui">IUI</option>
                            <option value="ovulation_drugs">
                                Ovulation Drugs
                            </option>
                            <option value="others">Others</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <label>
                        Number of foetuses:{' '}
                        <input value={this.state.numOfFoetuses} />
                    </label>
                    <br />
                    <br />
                    <label>
                        Folic acid supplementation:
                        <select value={this.state.folicAcidSuppUsed}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    {this.state.folicAcidSuppUsed ? (
                        <>
                            <label>
                                Folic acid supplementation start date:
                                <PickDate
                                    startDate={this.state.EDD}
                                    handleChange={this._handleDateChange}
                                />
                            </label>
                            <br />
                            <br />
                        </>
                    ) : null}
                    <label>
                        Illicit drug use:
                        <select value={this.state.illicitDrugUse}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <div className={pregnancy_style.pregnancy_image_div}>
                        <h4>Image data</h4>
                        {this.state.addNewImageData_cache.map((el) => (
                            <div
                                key={el.id}
                                className={pregnancy_style.one_tentative_image}
                            >
                                <span
                                    onClick={() =>
                                        this.setState({
                                            addNewImageData_cache:
                                                this.state.addNewImageData_cache.filter(
                                                    (ele) => ele.id !== el.id
                                                ),
                                        })
                                    }
                                >
                                    X
                                </span>
                                <span>Date: {el.date.toISOString()}</span>
                                <br />
                                <span>Mode: {el.mode}</span>
                                <br />
                                <span>Result: {el.result}</span>
                                <br />
                            </div>
                        ))}
                        {this.state.showAddNewImageData ? (
                            <div>
                                <label>
                                    Image date:
                                    <PickDate
                                        startDate={
                                            this.state.addNewImageData_date
                                        }
                                        handleChange={this._handleDateChange}
                                    />
                                </label>
                                <br />
                                <br />
                                <label>
                                    Mode:
                                    <select
                                        value={this.state.folicAcidSuppUsed}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </label>
                                <br />
                                <br />
                                <label>
                                    Result:
                                    <select
                                        value={this.state.folicAcidSuppUsed}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </label>
                                <button
                                    onClick={() => {
                                        this.setState((oldState) => ({
                                            addNewImageData_cache:
                                                oldState.addNewImageData_cache.concat(
                                                    {
                                                        id: oldState.addNewImageData_counter,
                                                        date: oldState.addNewImageData_date,
                                                        mode: oldState.addNewImageData_mode,
                                                        result: oldState.addNewImageData_result,
                                                    }
                                                ),
                                            addNewImageData_counter:
                                                oldState.addNewImageData_counter +
                                                1,
                                        }));
                                    }}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() =>
                                        this.setState({
                                            showAddNewImageData: false,
                                        })
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() =>
                                    this.setState({ showAddNewImageData: true })
                                }
                            >
                                Add new image data
                            </button>
                        )}
                    </div>
                    <br />
                    <br />
                    <button>Save</button>
                </div>
            </>
        );
    }
}
