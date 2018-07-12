import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/dataPage.jsx';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import cssTexts from '../../../css/inlinetexts.module.css';
import cssButtons from '../../../css/buttons.module.css';
import { PickDate } from './datepicker.jsx';
import { timingSafeEqual } from 'crypto';

@connect(state => ({ patientId: state.patientProfile.data.id }), dispatch => ({ createVisit: body => dispatch(createVisitAPICall(body)) }))
export class CreateVisit extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            SBP: '',
            DBP: '',
            HR: '',
            weight: '',
            academicConcern: 'true',
            height: ''
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleKeyChange = this._handleKeyChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleKeyChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        console.log(newState);
        this.setState(newState);
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        const { SBP, DBP, HR, weight, academicConcern, height } = this.state;
        return {
            visitData: {
                patientId: this.props.patientId,
                visitDate: date.toDateString()
            },
            VSData :{
                add: {1: SBP, 2: HR, 3: DBP, 4: height, 5: weight, 6: academicConcern }
            },
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createVisit(requestBody);
    }

    render() {
        const { startDate, SBP, DBP, HR, weight, academicConcern, height } = this.state;
        return (<div>
            <BackButton to={`/patientProfile/${this.props.patientId}`}/>
            <h2>CREATE A NEW VISIT</h2>
            <span class={cssTexts.centeredBlock}>Please enter date on which the visit occurs / occured: <br/> <span className={cssTexts.centeredBlock}><PickDate startDate={startDate} handleChange={this._handleDateChange}/></span> </span>
            <br/><br/><span>Systolic blood pressure: <input name='SBP' value={SBP} onChange={this._handleKeyChange}/> mmHg </span>
            <br/><br/><span>Diastolic blood pressure: <input name='DBP' value={DBP} onChange={this._handleKeyChange}/> mmHg </span>
            <br/><br/><span>Heart rate: <input name='HR' value={HR} onChange={this._handleKeyChange}/> bpm </span>
            <br/><br/><span>Weight: <input name='weight' value={weight} onChange={this._handleKeyChange}/> kg </span>
            <br/><br/><span>Height: <input name='height' value={height} onChange={this._handleKeyChange}/> cm </span>
            <br/><br/><span>Academic concern: 
                <select name='academicConcern' onChange={this._handleKeyChange} value={academicConcern}>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                </select>
            </span>
            <div onClick={this._handleSubmitClick} className={cssButtons.createPatientButton} style={{ width: '30%' }}>Submit</div>
        </div>);
    }
}