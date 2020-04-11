import React, { Component } from 'react';
import override_style from './overrideStyle.module.css';
import EDSSPage from '../../../EDSScalculator/calculator';

export class EDSSWrapper extends Component {
    render() {
        return <EDSSPage match={this.props.match} location={this.props.location} override_style={override_style}/>;
    }
}