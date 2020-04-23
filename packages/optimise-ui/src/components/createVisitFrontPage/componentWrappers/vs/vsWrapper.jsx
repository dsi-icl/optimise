import React, { Component } from 'react';
import { VisitData } from '../../../medicalData/visitDataPage';
import override_style from '../overrideStyle.module.css';
import style from '../../frontpage.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

export class VSFrontPageWrapper extends Component {
    render() {
        return (
            <>
                <div className={style.page}>
                    <div className={scaffold_style.padding_div}>
                        <p>Please enter vital signs:</p>
                        <VisitData childRef={component => { this.form = component; }} elementType='visit' match={this.props.match} category={'vitals'} override_style={override_style} renderedInFrontPage={true} />
                    </div>
                </div>
                <FrontPageNavigationButton onClickNext={(ev) => { this.form._handleSubmit(ev); this.forceUpdate(); }} formSaved={() => this.form.state.saved} match={this.props.match} location={this.props.location}/>
            </>
        );
    }
}