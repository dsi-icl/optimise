import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ControlledInputField, ControlledSelectField } from '../medicalData/dataPage.jsx';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker.jsx';
import cssButtons from '../../../css/buttons.css';
import store from '../../redux/store.js';
import { createPatientCall } from '../../redux/actions/createPatient.js';

@connect(state => ({ fields: state.availableFields.demoFields[0], patientId: state.createPatient.patientId }))
export class CreatePatientComponent extends Component {    //get these props from state: this.props.visitFields, this.props.patientId
    constructor() {
        super();
        this.state = { 
            dispatched: false,
            DOB: moment(),
            error: false,
            gender: 0,
            dominant_hand: 0,
            ethnicity: 0,
            country_of_origin: 0,
            alcohol_usage: 0,
            smoking_history: 0 };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            DOB: date,
            error: false
        });
    }

    _handleChange(ev){
        const newState = { error: false };
        newState[ev.target.name] = parseInt(ev.target.value, 10);
        this.setState(newState);
    }

    _handleSubmit(ev){
        ev.preventDefault();
        const date = this.state.DOB._d.toDateString();
        const patientId = this.props.match.params.patientIdCreated;
        for (let each in this.state) {
            if (this.state[each] === 0) {
                this.setState({ error: true });
                return;
            }
        }
        const demoData = { ...this.state };
        delete demoData.error;
        delete demoData.dispatched;
        demoData.DOB = date
        const patientData = { aliasId: patientId, study: 'optimise' };
        const body = { patientData: patientData, demoData: demoData, patientId: patientId };
        store.dispatch(createPatientCall(body));
        this.setState({ dispatched: true });
    }

    render() {
        if (!this.state.dispatched) {
            const style = {
                textAlign: 'center',
                fontSize: 14,
                marginTop: 40
            };
            const { genders, dominant_hands, ethnicities, countries, alcohol_usage, smoking_history } = this.props.fields;
            return (
                <div style={style}>
                    <b> To create patient {this.props.match.params.patientIdCreated}, please enter the following data: </b><br/><br/>
                    <form onSubmit={this._handleSubmit}>
                        Date of birth: <PickDate startDate={this.state.DOB} handleChange={this._handleDateChange}/> <br/>
                        Gender: <SelectField name='gender' value={this.state.gender} options={genders} handler={this._handleChange}/> <br/><br/>
                        Dominant hand: <SelectField name='dominant_hand' value={this.state['dominant_hand']} options={dominant_hands} handler={this._handleChange}/> <br/><br/>
                        Ethnicity: <SelectField name='ethnicity' value={this.state['ethnicity']} options={ethnicities} handler={this._handleChange}/> <br/><br/>
                        Country of origin: <SelectFieldCountry name='country_of_origin' value={this.state['country_of_origin']} options={countries} handler={this._handleChange}/> <br/><br/>
                        Alcohol usage: <SelectField name='alcohol_usage' value={this.state['alcohol_usage']} options={alcohol_usage} handler={this._handleChange}/> <br/><br/>
                        Smoking history: <SelectField name='smoking_history' value={this.state['smoking_history']} options={smoking_history} handler={this._handleChange}/> <br/><br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    {this.state.error ? <div style={{ color: 'red' }}><br/>None of the fields can be unselected! Please try again.</div> : null}

                </div>
            )
        } else {
            return <Redirect to={`/patientProfile/${this.props.match.params.patientIdCreated}`}/>;
        }
    }
}


/**
 * @prop {string} this.props.name - field name
 * @prop {string} this.props.value - value (usually passed from state of parent)
 * @prop {Array} this.props.options - list of options to be rendered; each option would be {id: x, value: 'abc'}
 * @prop {Function} this.props.handler - event listener passed down by parent to change the state of parent
 */
class SelectField extends Component {
    render() {
        return (<select onChange={this.props.handler} name={this.props.name} value={this.props.value}>
            <option value={0}>unselected</option>
            {this.props.options.map(el => <option key={el.id} value={el.id}>{el.value}</option>)}
        </select>)
    }
}




/* A SEPARATE MAPPING JUST FOR COUNTRIES...BECAUSE OF INCONSISTENCY IN BACKEND..WILL CHANGE ONCE BACKEND IS PATCHED */

/**
 * @prop {string} this.props.name - field name
 * @prop {string} this.props.value - value (usually passed from state of parent)
 * @prop {Array} this.props.options - list of options to be rendered; each option would be {id: x, value: 'abc'}
 * @prop {Function} this.props.handler - event listener passed down by parent to change the state of parent
 */
class SelectFieldCountry extends Component {
    render() {
        return (<select onChange={this.props.handler} name={this.props.name} value={this.props.value}>
            <option value={0}>unselected</option>
            {this.props.options.map(el => <option key={el.id} value={el.id}>{el.country}</option>)}
        </select>)
    }
}
