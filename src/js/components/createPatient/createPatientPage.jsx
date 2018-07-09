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
        this.state = { DOB: moment() };
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            DOB: date
        });
    }

    _handleSubmit(ev){
        const bodydata = {}
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
                {this.props.fields.map(el => {
                    if (el.definition !== 'DOB') {
                        return <span key={el.id}>{el.definition}: <ControlledSelectField permittedValues={el.permittedValues} fieldId={el.id}/> <br/><br/></span>;
                    } else {
                        return <span key={el.id}>{el.definition}: <PickDate startDate={this.state.DOB} handleChange={this._handleDateChange}/> <br/><br/></span>;
                    }
                })
                }

                <div className={cssButtons.createPatientButton} style={{ width: '30%' }} onClick={this._handleSubmit}>Submit</div>

            </div>
        )
    }
}

