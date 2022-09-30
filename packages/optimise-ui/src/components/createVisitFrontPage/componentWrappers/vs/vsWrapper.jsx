import React, { Component } from 'react';
import { VisitData } from '../../../medicalData/visitDataPage';
import override_style from '../overrideStyle.module.css';
import style from '../../frontpage.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { connect } from 'react-redux';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';
import EditPregnancy from '../../../editMedicalElements/editPregnancy';

@connect(state => ({
    data: state.patientProfile.data,
    }))
class VSFrontPageWrapper extends Component {
    render() {
        return (
            <>
                <div className={style.page}>
                    <div className={scaffold_style.padding_div}>
                        {
                            this.props.data.demographicData && this.props.data.demographicData.gender !== 1
                                ?
                                <>
                                    <p style={{ marginBottom: 0, fontSize: '1.1rem' }}>Please update this list of pregnancies:</p>
                                    <EditPregnancy match={this.props.match} location={this.props.location} renderedInFrontPage={true}/>
                                    <br/><br/>
                                </>
                                :
                                null
                        }
                        <p style={{ fontSize: '1.1rem' }}>Please enter vital signs:</p>
                        <VisitData childRef={component => { this.form = component; }} elementType='visit' match={this.props.match} category={'vitals'} override_style={override_style} renderedInFrontPage={true} />
                    </div>
                </div>
                <FrontPageNavigationButton onClickNext={(ev) => { this.form._handleSubmit(ev); this.forceUpdate(); }} formSaved={() => this.form.state.saved} match={this.props.match} location={this.props.location}/>
            </>
        );
    }
}

export {VSFrontPageWrapper};