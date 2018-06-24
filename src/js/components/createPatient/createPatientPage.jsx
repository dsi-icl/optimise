import { connect } from 'react-redux';
import React, { Component } from 'react';
import saveIcon from '../../../statics/icons/icons8-tick-box-48.png';
import cancelIcon from '../../../statics/icons/icons8-close-window-48.png';


@connect(state => ({ fields: state.availableFields.demoFields, patientId: state.createPatient.patientId }))
export class CreatePatientComponent extends Component {    //get these props from state: this.props.visitFields, this.props.patientId
    render() {
        const style = {
            textAlign: 'center',
            fontSize: 14,
            marginTop: 40
        }

        const imgStyle = {
            width: 40,
            cursor: 'pointer'
        }
        return (
            <div style={style}>
                <img title='cancel' style={imgStyle} src={cancelIcon} alt='cancel'/>
                <b> To create patient {this.props.patientId}, please enter the following data: </b><br/><br/>
                {this.props.fields.map(el => 
                    <span key={el.id}>{el.definition}: <DataField field={el}/> <br/><br/></span>
                )}
                <img title='create this patient' style={imgStyle} src={saveIcon} alt='save'/>

            </div>
        )
    }
}


export class DataField extends Component {
    render() {
        if (this.props.field.type === 'C'){    //if field is category
            if (this.props.value === undefined){
                return (
                    <select>
                        {this.props.field['permittedValues'].split(',').map(el => <option key={el} value={el}>{el}</option>)}
                    </select>
                )
            } else {
                return (
                    <select>
                        {this.props.field['permittedValues'].split(',').map(el => 
                            el === this.props.value ? <option value={el} selected>{el}</option> : <option value={el}>{el}</option>
                        )}
                    </select>
                )
            }
        } else if (this.props.field.type === 'D') {
            return <DateSelector/>;
        } else {
            if (this.props.value === undefined){
                return <input type='text'></input>
            } else {
                return <input type='text' value={this.props.value}></input>
            }
        }
    }
}

export class DateSelector extends Component {     //not finished
    constructor(){
        super();
        this.state = { date: { day: 'dd', month: 'mm', year: 'yyyy' }, value: '' };
        this._handleEnterKey = this._handleEnterKey.bind(this);
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
    }

    _handleKeyStroke(ev){
        this.setState({ value: ev.target.value });
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    render(){
        return (
            <input type='text' value={this.state.value} onFocus={this._handleFocus} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey}></input>
        )
    }
}