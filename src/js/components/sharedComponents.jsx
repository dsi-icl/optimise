import React, {Component} from 'react';
import css from '../../css/patientProfile.css.js';
import plusSignIcon from '../../statics/icons/icons8-plus-math-64.png'; 


export class Button extends Component {
    constructor() {
        super();
    }

    render() {
        return <div style={this.props.style}>{this.props.text}</div>
    }
}

export class PlusButton extends Component {
    render() {
        return <img src={plusSignIcon} style={css.plusSign}/>
    }
}