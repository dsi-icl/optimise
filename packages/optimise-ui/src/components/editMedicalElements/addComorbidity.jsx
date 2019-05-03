import React, { Component } from 'react';
import { BackButton } from '../medicalData/utils';
import { ICD11Picker } from '../comorbidityPicker/icd11Picker';
import store from '../../redux/store';
import { createComorbidityAPICall } from '../../redux/actions/comorbidities';
import style from './editMedicalElements.module.css';

export default class AddComorbidityPage extends Component {
    constructor() {
        super();
        this.state = {
            value: undefined
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleValueChange = this._handleValueChange.bind(this);
    }

    _handleValueChange(value) {
        this.setState({ value, error: undefined });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.value === undefined) {
            this.setState({ error: 'Invalid value.' });
            return;
        }
        store.dispatch(createComorbidityAPICall({ patientId: this.props.match.params.patientId, data: { visitId: parseInt(this.props.match.params.visitId), comorbidity: parseInt(this.state.value) } }));
    }

    render() {
        return <>
            <div className={style.ariane}>
                <h4 onClick={this._handleSubmit}>COMORBIDITIES</h4>
                <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
            </div>
            <form className={style.panel}>
                <ICD11Picker value={this.state.value} onChange={this._handleValueChange} />
                <br /><br />

                <button onClick={this._handleSubmit}>Submit</button>
                {
                    this.state.error ? <div>{this.state.error}</div> : null
                }
            </form>
        </>;
    }
}