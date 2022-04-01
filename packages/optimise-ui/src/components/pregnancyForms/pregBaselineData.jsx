import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';
import style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';
import { apiHelper } from '../../redux/fetchHelper';
import { getPatientProfileById } from '../../redux/actions/searchPatient';
import store from '../../redux/store';

function mapStateToProps(state) {
    return {
        patientProfile: state.patientProfile,
    };
}
@connect(mapStateToProps)
@withRouter
export class PregnancyBaselineDataForm extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            showAddNewImageData: false,
            addNewImageData_date: moment(),
            addNewImageData_mode: 'uss',
            addNewImageData_result: 'yes',
            addNewImageData_cache: [],
            LMP: moment(), //last menstrual period
            maternalAgeAtLMP: undefined,
            maternalBMI: undefined,
            EDD: moment(), //estimated delivery date
            ART: 'none', //assisted reproductive technology method
            numOfFoetuses: undefined, //number of foetuses
            folicAcidSuppUsed: 'no', //folic acid supplementation used
            folicAcidSuppUsedStartDate: null, //if so, folic acid supplementation start date
            illicitDrugUse: 'no',
            weight: 0,
            height: 0,
        };
        this.originalValues = {};
    }

    static getDerivedStateFromProps(props, state) {
        const isEdit = props.match.path.includes('/edit');
        if (props.patientProfile?.data?.pregnancy?.length > 0 && isEdit) {
            const pregnancyId = props.match.params.pregnancyId;
            const pregnancyDataId = props.match.params.pregnancyDataId;

            const pregnancyData = props.patientProfile.data.pregnancy.find(
                (pregnancy) => pregnancy.id === Number(pregnancyId)
            );

            const pregnancyDataToEdit =
                pregnancyData.dataEntries &&
                pregnancyData.dataEntries.find(
                    (data) => data.id === Number(pregnancyDataId)
                );

            const newState = {};

            Object.keys(pregnancyDataToEdit).forEach((key) => {
                newState[key] = pregnancyDataToEdit[key];
            });

            newState.LMP = moment(newState.LMP);
            newState.EDD = moment(newState.EDD);
            newState.folicAcidSuppUsedStartDate = moment(
                newState.folicAcidSuppUsedStartDate
            );

            return newState;
        }
    }

    calculateBMI = () => {
        const { weight, height } = this.state;
        let BMI = (weight / ((height * height) / 10000)).toFixed(2);
        return BMI;
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    _handleDateChangeLMP = (date) => {
        this.setState({
            LMP: date,
        });
    };

    _handleDateChangeEDD = (date) => {
        this.setState({
            EDD: date,
        });
    };

    _handleDateChangeFolicAcid = (date) => {
        this.setState({
            folicAcidSuppUsedStartDate: date,
        });
    };

    handleSave = async (e) => {
        const patientId = this.props.match.params.patientId;
        const pregnancyId = this.props.match.params.pregnancyId;

        const requiredFields = [
            'LMP',
            'EDD',
            'maternalAgeAtLMP',
            'weight',
            'height',
            'ART',
            'numOfFoetuses',
            'illicitDrugUse',
            'folicAcidSuppUsed',
        ];

        for (let item of requiredFields) {
            if (!this.state[item]) {
                this.setState({ error: true });
                return;
            }
        }

        const pregnancyData = {
            maternalBMI: this.calculateBMI(),
            LMP: this.state.LMP.toISOString(),
            EDD: this.state.EDD.toISOString(),
            maternalAgeAtLMP: this.state.maternalAgeAtLMP,
            ART: this.state.ART,
            numOfFoetuses: this.state.numOfFoetuses,
            folicAcidSuppUsed: this.state.folicAcidSuppUsed,
            folicAcidSuppUsedStartDate:
                this.state.folicAcidSuppUsedStartDate &&
                this.state.folicAcidSuppUsedStartDate.toISOString(),
            illicitDrugUse: this.state.illicitDrugUse,
            dataType: 'baseline',
            weight: this.state.weight,
            height: this.state.height,
            imagingData: this.state.addNewImageData_cache,
        };

        await apiHelper(`/pregnancy/${patientId}/${pregnancyId}`, {
            method: 'POST',
            body: JSON.stringify(pregnancyData),
        });

        store.dispatch(getPatientProfileById(patientId));
    };

    getPageType = () =>
        this.props.match.path.includes('/add') ? 'add' : 'edit';

    getHeading = () =>
        this.getPageType() === 'add'
            ? 'Add Baseline Data'
            : 'Edit Baseline Data';

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
                        Date of last menstrual period (LMP):{' '}
                        <PickDate
                            startDate={this.state.LMP}
                            handleChange={this._handleDateChangeLMP}
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Maternal age at LMP:{' '}
                        <input
                            onChange={this.handleChange}
                            name="maternalAgeAtLMP"
                            value={this.state.maternalAgeAtLMP}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Weight (in kg):
                        <input
                            onChange={this.handleChange}
                            name="weight"
                            type="number"
                            value={this.state.weight}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Height (in cm):
                        <input
                            onChange={this.handleChange}
                            name="height"
                            type="number"
                            value={this.state.height}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Maternal BMI:{' '}
                        <input
                            disabled={true}
                            onChange={this.handleChange}
                            name="maternalBMI"
                            value={this.calculateBMI()}
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Estimated date of delivery:{' '}
                        <PickDate
                            startDate={this.state.EDD}
                            handleChange={this._handleDateChangeEDD}
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Assisted Reproductive Technology method:
                        <br />
                        <select
                            onChange={this.handleChange}
                            name="ART"
                            value={this.state.ART}
                        >
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
                        Number of foetuses:
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
                            onChange={this.handleChange}
                            name="folicAcidSuppUsed"
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
                                    handleChange={
                                        this._handleDateChangeFolicAcid
                                    }
                                />
                            </label>
                            <br />
                            <br />
                        </>
                    ) : null}
                    <label>
                        Illicit drug use:
                        <select
                            onChange={this.handleChange}
                            name="illicitDrugUse"
                            value={this.state.illicitDrugUse}
                        >
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
                                        onChange={this.handleChange}
                                        name="addNewImageData_mode"
                                        value={this.state.addNewImageData_mode}
                                    >
                                        <option value="uss">USS</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                                <br />
                                <br />
                                <label>
                                    Result:
                                    <select
                                        onChange={this.handleChange}
                                        name="addNewImageData_result"
                                        value={
                                            this.state.addNewImageData_result
                                        }
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </label>
                                <button
                                    onClick={() => {
                                        const {
                                            addNewImageData_date,
                                            addNewImageData_result,
                                            addNewImageData_cache,
                                            addNewImageData_mode,
                                        } = this.state;

                                        this.setState({
                                            addNewImageData_cache: [
                                                ...addNewImageData_cache,
                                                {
                                                    date: addNewImageData_date,
                                                    mode: addNewImageData_mode,
                                                    result: addNewImageData_result,
                                                },
                                            ],
                                            showAddNewImageData: false,
                                        });
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
