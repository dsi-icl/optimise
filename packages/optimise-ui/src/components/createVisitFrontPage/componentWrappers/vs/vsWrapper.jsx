import React, { Component } from 'react';
import { VisitData } from '../../../medicalData/visitDataPage';
import override_style from '../overrideStyle.module.css';
import scaffold_style from '../scaffoldStyle.module.css';

export class VSFrontPageWrapper extends Component {
    render() {
        return <div className={scaffold_style.padding_div}>
            <p>Please enter vital signs:</p>
            <VisitData elementType='visit' match={this.props.match} category={'vitals'} override_style={override_style}/>
        </div>;
    }
}