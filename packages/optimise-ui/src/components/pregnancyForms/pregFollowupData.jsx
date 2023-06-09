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
import style from '../patientProfile/patientProfile.module.css';
import moment from 'moment';
import { editPregnancyDataAPICall } from '../../redux/actions/demographicData';


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
class PregnancyFollowupDataForm extends Component {
    constructor(props) {
        super();
        const { childRef } = props;
        if (childRef) {
            childRef(this);
        }
        this.state = {
            dataType: 'followup',
            LMP: moment(), //last menstrual period
            maternalAgeAtLMP: undefined,
            maternalBMI: undefined,
            EDD: moment(), //estimated delivery date
            PNI_date: moment(), //prenatal imaging date
            ART: 'none', //assisted reproductive technology method
            numOfFoetuses: undefined, //number of foetuses
            folicAcidSuppUsed: 'no', //folic acid supplementation used
            folicAcidSuppUsedStartDate: moment(), //if so, folic acid supplementation start date
            illicitDrugUse: false,
            saved: false

        };


        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
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

    _handleSubmit(ev) {
        ev.preventDefault();
        console.log('pregFollowupData');

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

    _handleInputChange(event, field) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [field]: value });
    }


    render() {
        if (this.props.formData) {
            for (const key in this.state) {
                if ((this.state).hasOwnProperty(key)) {
                    this.state[key] = this.props.formData[key];
                }
            }
        }
        return (
            <>
                {
                    this.props.renderedInFrontPage ?
                        null
                        :
                        <div className={style.ariane}>
                            <h2>Edit followup record</h2>
                        </div>
                }
                <div className={this.props.renderedInFrontPage ? null : style.panel}>
                    <label>
                        Prenatal imaging:{' '}
                        <PickDate startDate={this.state.PNI_date} handleChange={(date) => this._handleDateChange(date, 'PNI_date')} /></label><br /><br />

                    <label>Estimated date of delivery: <PickDate startDate={this.state.EDD} handleChange={(date) => this._handleDateChange(date, 'EDD')} /></label><br /><br />

                    <label>Number of foetuses: <input defaultValue={this.state.numOfFoetuses} onChange={(event) => this._handleInputChange(event, 'numOfFoetuses')} /></label><br /><br />

                    <label>Maternal BMI: <input defaultValue={this.state.maternalBMI} onChange={(event) => this._handleInputChange(event, 'maternalBMI')} /></label><br /><br />

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
                                    <PickDate startDate={this.state.folicAcidSuppUsedStartDate} handleChange={(date) =>
                                        this._handleDateChange(date, 'folicAcidSuppUsedStartDate')
                                    } />
                                </label><br /><br />
                            </>
                            :
                            null
                    }

                    <label>Illicit drug use:
                        <select defaultValue={this.state.illicitDrugUse}
                            onChange={(event) =>
                                this.setState({ illicitDrugUse: event.target.value })
                            }>
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </select>
                    </label><br /><br />
                    {this.props.renderedInFrontPage ? null :
                        <button type='submit'>Save</button>
                    }
                </div>
            </>);
    }
}

export default PregnancyFollowupDataForm;
