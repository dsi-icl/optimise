import React, {Component} from 'react';
import css from '../../css/patientProfile.css.js';
import plusSignIcon from '../../statics/icons/icons8-plus-math-64.png'; 
import Radium from 'radium';


export class Button extends Component {
    constructor() {
        super();
    }

    render() {
        return <div style={this.props.style}>{this.props.text}</div>
    }
}

Button = Radium(Button);

export class PlusButton extends Component {
    render() {
        return <img src={plusSignIcon} style={css.plusSign}/>
    }
}