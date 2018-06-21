import React, {Component} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {BackButton} from '../dataPage.jsx';
import { PickDate} from './createVisit.jsx';

class CreateTest_toConnect extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            type: 'not selected'
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleSelectOption = this._handleSelectOption.bind(this);
    }

    _handleDateChange(date) {
        this.setState({startDate: date});
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        return {
            visitId: null,    ///change this
            type: this.state.type,
            expectedDate: {day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        console.log(requestBody);
        //this.props.createVisit(requestBody);
    }

    _handleSelectOption(ev) {
        this.setState({type: ev.target.value});
    }

    render() {
        return (<div>
            <BackButton to={`/patientProfile/${this.props.patientId}`}/>
            <h2>CREATE A NEW TEST</h2>
            <span style={{textAlign: 'center', display: 'block', width: '60%', margin:'0 auto'}}>Select test type:
                <br/>
                <select value={this.state.type} onChange={this._handleSelectOption}>
                    <option key='not selected' value='not selected'>not selected</option>
                    {this.props.availableTypes.map(el => 
                        <option key={el.id} value={el.id}>{el.name}</option>
                    )}
                </select>
                <br/><br/><br/>
            </span>
            <span style={{textAlign: 'center', display: 'block', width: '60%', margin:'0 auto'}}>Date on which test occurred or is expected to occur: <br/> <span style={{display: 'block', width: '50%', margin:'0 auto'}}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange}/></span> </span>
            <div onClick={this._handleSubmitClick} style={{cursor: 'pointer', textAlign: 'center', backgroundColor: 'lightgrey', borderRadius: 20, width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: 15}}>Submit</div>
        </div>);
    }
}

export const CreateTest = connect(state => ({patientId: state.patientProfile.data.patientId, availableTypes: state.availableFields.testTypes}))(CreateTest_toConnect);