import React, { Component } from 'react';
import { ICD11Picker } from '../comorbidityPicker/icd11Picker';
import store from '../../redux/store';
import { createComorbidityAPICall } from '../../redux/actions/comorbidities';

export default class AddComorbidityPage extends Component {
    constructor() {
        super();
        this.state = {
            value: undefined
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleValueChange = this._handleValueChange.bind(this);
    }

    _handleValueChange(value){
        this.setState({ value, error: undefined });
    }

    _handleSubmit() {
        if (this.state.value === undefined) {
            this.setState({ error: 'Invalid value.' });
            return;
        }
        store.dispatch(createComorbidityAPICall({ patientId: this.props.match.params.patientId, data: { visitId: parseInt(this.props.match.params.visitId), comorbidity: parseInt(this.state.value) } }));
    }

    render() {
        return <>
        <h4 onClick={this._handleSubmit}>Add comorbidity to visit</h4>
        <ICD11Picker value={this.state.value} onChange={this._handleValueChange}/>
        <button onClick={this._handleSubmit}>Submit</button>
        {
            this.state.error ? <div>{this.state.error}</div> : null
        }
        </>;
    }
}