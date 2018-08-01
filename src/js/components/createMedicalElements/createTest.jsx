import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createTestAPICall } from '../../redux/actions/tests';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
@connect(state => ({ patientId: state.patientProfile.data.id, visits: state.patientProfile.data.visits, types: state.availableFields.testTypes }), dispatch => ({ createTest: body => dispatch(createTestAPICall(body)) }))
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

    componentDidMount() {
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
        this.setState({
            testType: parseInt(ev.target.value, 10)
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate;
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                expectedDate: date.toISOString(),
                type: Number.parseInt(this.state.testType)
            }
        };
    }

    _handleSubmitClick(e) {
        e.preventDefault();
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;
        this.props.createTest(requestBody);
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Creating a new Test</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        <label htmlFor=''>Please enter date on which the test is expected to occur: </label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br /><br />
                        <label htmlFor='test'>What type of test is it?</label><br />
                        <select name='test' value={this.state.testType} onChange={this._handleTypeChange} autoComplete='off'>
                            {this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select><br /><br />
                        <button onClick={this._handleSubmitClick}>Submit</button>
                    </form>
                </>
            );
        } else {
            return null;
        }
    }
}