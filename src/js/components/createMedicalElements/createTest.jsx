import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker.jsx';
import { BackButton } from '../medicalData/dataPage.jsx';
import cssTexts from '../../../css/inlinetexts.module.css';
import cssButtons from '../../../css/buttons.module.css';
import { createTestAPICall } from '../../redux/actions/tests.js';

//not yet finished the dispatch
@connect(state => ({ visits: state.patientProfile.data.visits, types: state.availableFields.testTypes }), dispatch => ({ createTest: body => dispatch(createTestAPICall(body)) }))
export class CreateTest extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            testType: ''
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
    }

    componentDidMount(){
        this.setState({
            testType: this.props.types[0].id
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleTypeChange(ev) {
        console.log(ev.target.value);
        this.setState({
            testType: parseInt(ev.target.value, 10)
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        return { patientId: this.props.match.params.patientId,
            data: {
                visitId: this.props.match.params.visitId,
                expectedDate: date.toDateString(),
                type: this.state.testType
            }
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createTest(requestBody);
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            const visitDate = new Date(parseInt(this.props.visits.filter(visit => visit.visitId == params.visitId)[0].visitDate, 10)).toDateString();
            return (<div>
                <BackButton to={`/patientProfile/${params.patientId}`}/>
                <h2>CREATE A NEW TEST</h2>
                <span class={cssTexts.centeredBlock}><b>Visit:</b> {visitDate}</span>
                <br/>
                <span class={cssTexts.centeredBlock}>Please enter date on which the test is expected to occur: <br/> <span className={cssTexts.centeredBlock}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange}/></span> </span>
                <br/>
                <span class={cssTexts.centeredBlock}>What type of test is it? 
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