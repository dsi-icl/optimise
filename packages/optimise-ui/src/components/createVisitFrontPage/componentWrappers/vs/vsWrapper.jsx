import React, { Component } from 'react';
import { VisitData } from '../../../medicalData/visitDataPage';
import override_style from '../overrideStyle.module.css';

export class VSFrontPageWrapper extends Component {
    render() {
        return <VisitData elementType='visit' match={this.props.match} category={'vitals'} override_style={override_style}/>;
    }
}