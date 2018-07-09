import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker.jsx';
import { BackButton } from '../medicalData/dataPage.jsx';
import cssTexts from '../../../css/inlinetexts.css';
import cssButtons from '../../../css/buttons.css';
import { createCEAPICall } from '../../redux/actions/clinicalEvents.js';

//not yet finished the dispatch
@connect(state => ({ visits: state.patientProfile.data.visits, types: state.availableFields.clinicalEventTypes }), dispatch => ({ createCE: body => dispatch(createCEAPICall(body)) }))
export class CreateCE extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            ceType: ''
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    componentDidMount(){
        this.setState({
            ceType: this.props.types[0].id
        });
    }

    _handleTypeChange(ev) {
        console.log(ev.target.value);
        this.setState({
            ceType: parseInt(ev.target.value, 10)
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        return { patientId: this.props.match.params.patientId,
            data: {
                visitId: this.props.match.params.visitId,
                startDate: { day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                },
                type: this.state.ceType
            }
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createCE(requestBody);
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
                    <select value={this.state.testType} onChange={this._handleTypeChange}>
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