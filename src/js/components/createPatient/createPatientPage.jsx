import { connect } from 'react-redux';
import React, { Component } from 'react';
import { ControlledInputField, ControlledSelectField } from '../medicalData/dataPage.jsx';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker.jsx';
import cssButtons from '../../../css/buttons.css';

@connect(state => ({ fields: state.availableFields.demoFields, patientId: state.createPatient.patientId }))
export class CreatePatientComponent extends Component {    //get these props from state: this.props.visitFields, this.props.patientId
    constructor() {
        super();
        this.state = { DOB: moment(), error: false };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            DOB: date
        });
    }

    _handleChange(){
        this.setState({
            error: false
        });
    }

    _handleSubmit(ev){
        ev.preventDefault();
        const date = this.state.DOB._d;
        const bodydata = { 1: { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() } };
        for (let i = 1; i < 8; i++) {
            const field = ev.target[i].name;
            const value = ev.target[i].value;
            if (value === 'unselected') {
                this.setState({ error: true });
                return;
            }
            bodydata[field] = value;
        }
        console.log(bodydata);
    }

    render() {
        const style = {
            textAlign: 'center',
            fontSize: 14,
            marginTop: 40
        };
        return (
            <div style={style}>
                <b> To create patient {this.props.match.params.patientIdCreated}, please enter the following data: </b><br/><br/>
                <form onSubmit={this._handleSubmit}>
                    {this.props.fields.map(el => {
                        if (el.definition !== 'DOB') {
                            return <span onChange={this._handleChange} key={el.id}>{el.definition}: <ControlledSelectField permittedValues={el.permittedValues} fieldId={el.id}/> <br/><br/></span>;
                        } else {
                            return <span onChange={this._handleChange} key={el.id}>{el.definition}: <PickDate startDate={this.state.DOB} handleChange={this._handleDateChange}/> <br/><br/></span>;
                        }
                    })
                    }

                    <input type="submit" value="Submit"/>
                </form>
                {this.state.error ? <div><br/>None of the fields can be unselected! Please try again.</div> : null}

            </div>
        )
    }
}

