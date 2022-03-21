import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
//import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import style from '../patientProfile/patientProfile.module.css';
import moment from 'moment';
import { apiHelper } from '../../redux/fetchHelper';
import { getPatientProfileById } from '../../redux/actions/searchPatient';
import store from '../../redux/store';

function mapStateToProps(state) {
    return {
        patientProfile: state.patientProfile,
    };
}

@withRouter
@connect(mapStateToProps)
export class PregnancyFollowupDataForm extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            LMP: null, //last menstrual period
            maternalAgeAtLMP: undefined,
            maternalBMI: undefined,
            EDD: null, //estimated delivery date
            PNI_date: null, //prenatal imaging date
            ART: 'none', //assisted reproductive technology method
            numOfFoetuses: undefined, //number of foetuses
            folicAcidSuppUsed: 'no', //folic acid supplementation used
            folicAcidSuppUsedStartDate: null, //if so, folic acid supplementation start date
            illicitDrugUse: 'no',
        };
        this.originalValues = {};
    }

    _handleDateChangeEDD = (date) => {
        this.setState({
            EDD: date,
        });
    };

    _handleDateChangePNI = (date) => {
        this.setState({
            PNI_date: date,
        });
    };

    _handleDateChangeFollic = (date) => {
        this.setState({
            folicAcidSuppUsedStartDate: date,
        });
    };

    getPageType = () =>
        this.props.match.path.includes('/add') ? 'add' : 'edit';

    getHeading = () =>
        this.getPageType() === 'add'
            ? 'Add Followup Data'
            : 'Edit Followup Data';

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSave = async (e) => {
        const patientId = this.props.match.params.patientId;
        const pregnancyId = this.props.match.params.pregnancyId;

        const requiredFields = [
            'numOfFoetuses',
            'EDD',
            'illicitDrugUse',
            'folicAcidSuppUsed',
        ];

        for (let item of requiredFields) {
            if (this.state[item] === null || this.state[item] === undefined) {
                this.setState({ error: true });
                return;
            }
        }

        const pregnancyData = {
            numOfFoetuses: this.state.numOfFoetuses,
            folicAcidSuppUsed: this.state.folicAcidSuppUsed,
            folicAcidSuppUsedStartDate:
                this.state.folicAcidSuppUsedStartDate &&
                this.state.folicAcidSuppUsedStartDate.toISOString(),
            illicitDrugUse: this.state.illicitDrugUse,
            dataType: 'followup',
        };

        await apiHelper(`/pregnancy/${patientId}/${pregnancyId}`, {
            method: 'POST',
            body: JSON.stringify(pregnancyData),
        });

        store.dispatch(getPatientProfileById(patientId));
    };

    render() {
        return (
            <>
                {this.props.renderedInFrontPage ? null : (
                    <div className={style.ariane}>
                        <h2>{this.getHeading()}</h2>
                    </div>
                )}
                <div className={style.panel}>
                    <label>
                        Estimated date of delivery:
                        <PickDate
                            startDate={this.state.EDD}
                            handleChange={this._handleDateChangeEDD}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Number of foetuses:{' '}
                        <input
                            name="numOfFoetuses"
                            onChange={this.handleChange}
                            value={this.state.numOfFoetuses}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Folic acid supplementation:
                        <select
                            name="folicAcidSuppUsed"
                            onChange={this.handleChange}
                            value={this.state.folicAcidSuppUsed}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    {this.state.folicAcidSuppUsed === 'yes' ? (
                        <>
                            <label>
                                Folic acid supplementation start date:
                                <PickDate
                                    startDate={
                                        this.state.folicAcidSuppUsedStartDate
                                    }
                                    handleChange={this._handleDateChangeFollic}
                                />
                            </label>
                            <br />
                            <br />
                        </>
                    ) : null}

                    <label>
                        Illicit drug use:
                        <select
                            name="illicitDrugUse"
                            onChange={this.handleChange}
                            value={this.state.illicitDrugUse}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <button onClick={this.handleSave}>Save</button>
                    {this.state.error ? (
                        <>
                            <div className={style.error}>
                                None of the fields can be empty!
                            </div>
                            <br />
                            <br />
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}
