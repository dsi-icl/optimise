import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { PickDate } from './datepicker.jsx';
import { BackButton } from '../medicalData/dataPage.jsx';
import cssTexts from '../../../css/inlinetexts.css';
import cssButtons from '../../../css/buttons.css';

//not yet finished the dispatch
@connect(state => ({ visits: state.patientProfile.data.visits, types: state.availableFields.clinicalEvents }), dispatch => ({ createVisit: body => dispatch('') }))
export class CreateCE extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment()
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        return {
            patientId: this.props.patientId,
            visitDate: { day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createVisit(requestBody);
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            const visitDate = new Date(parseInt(this.props.visits.filter(visit => visit.visitId == params.visitId)[0].visitDate, 10)).toDateString();
            return (<div>
                <BackButton to={`/patientProfile/${params.patientId}`}/>
                <h2>CREATE A NEW EVENT</h2>
                <span class={cssTexts.centeredBlock}><b>Visit:</b> {visitDate}</span>
                <br/>
                <span class={cssTexts.centeredBlock}>Please enter date on which the event occurred: <br/> <span className={cssTexts.centeredBlock}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange}/></span> </span>
                <br/>
                <span class={cssTexts.centeredBlock}>What type of event is it? 
                    <select>
                        {this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                    </select>
                </span>
                <div onClick={this._handleSubmitClick} className={cssButtons.createPatientButton} style={{ width: '30%' }}>Submit</div>
            </div>);
        } else {
            return null;
        }
    }
}