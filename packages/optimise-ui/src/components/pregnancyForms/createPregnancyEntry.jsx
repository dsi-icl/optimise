import React, { Component } from 'react';
import { examplePregnancyData } from './exampleData';
//import { PregnancyBaselineDataForm } from './pregBaselineData';
import PregnancyBaselineDataForm from './pregBaselineData';
//import { PregnancyPostDataForm } from './pregPostData';
import PregnancyPostDataForm from './pregPostData';
//import { PregnancyFollowupDataForm } from './pregFollowupData';
import PregnancyFollowupDataForm from './pregFollowupData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { createPregnancyDataAPICall } from '../../redux/actions/demographicData';
import store from '../../redux/store';
import { Link } from 'react-router-dom';
import PregnancyList from './pregnancyList';
import EditPregnancy from '../editMedicalElements/editPregnancy';


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class CreatePregnancyEntry extends Component {
    constructor() {
        super();
        this.state = {
            entryType: 'followup',
            saved: false,
            formData: null


        };

        this._renderSwitch = this._renderSwitch.bind(this);
        this.pregnancyForm = null;
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._createPregnancyEntry = this._createPregnancyEntry.bind(this);

        // this._handleClick = this._handleClick.bind(this);
        // this._deleteFunction = this._deleteFunction.bind(this);
        // this._handleDateChange = this._handleDateChange.bind(this);
        // this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
    }

    _createPregnancyEntry() {

        const currentVisitId = parseInt(this.props.match.params.visitId);
        const currentVisit = this.props.data.visits.filter((el) => parseInt(el.id) === currentVisitId);
        const currentVisitDate = currentVisit[0].visitDate;

        // var date = new Date(parseInt(currentVisitDate));
        // console.log("visitdate", date.toUTCString());

        const body = {
            patientId: this.props.data.patientId,
            body: {
                date: currentVisitDate,
                dataType: 'baseline',
                visitId: currentVisitId
            }

        };

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(createPregnancyDataAPICall(body));
            this.setState({ addMore: false });
        });

    }



    _handleFormSubmit(ev) {
        console.log("submitted");
        if (this.pregnancyForm) {
            this.pregnancyForm._handleSubmit(ev);
        }
    }

    _renderSwitch(entryType) {
        const { childRef } = this.props;
        switch (entryType) {
            case 'baseline':
                return <PregnancyBaselineDataForm
                    childRef={childRef}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    formData={this.state.formData} />;
            case 'followup':
                return <PregnancyFollowupDataForm
                    childRef={childRef}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    formData={this.state.formData} />;
            case 'term':
                return <PregnancyPostDataForm
                    childRef={childRef}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    formData={this.state.formData} />;
            default: return <> </>
        }
    }

    render() {
        console.log("createPregnancyEntry", this.props.data);

        const { visitFields, childRef, renderedInFrontPage } = this.props;



        // const patientPregnancyEntries = this.props.data.pregnancyEntries;

        // let visitEntry = patientPregnancyEntries.filter((el) => parseInt(el.visitId) === parseInt(this.props.match.params.visitId))

        // if (!visitEntry.length) {
        //     this._createPregnancyEntry()
        // }
        // else {
        //     this.state.formData = visitEntry[0];
        // }

        const matchId = this.props.match.params.entryId;

        const data = examplePregnancyData.reduce((a, el) => { a = a.concat(el.pregnancyDataEntries); return a; }, []);

        //const data = this.props.data.pregnancy.reduce((a, el) => { a = a.concat(el.pregnancyDataEntries); return a; }, []);

        const matchedEntry = data.filter(el => el.id === parseInt(matchId));

        console.log("edit pregnancy", this.props)

        // if (!matchedEntry || matchedEntry.length !== 1) {
        //     return 'An error occured.';
        // }



        return (
            <div style={{ 'display': 'flex' }}>
                <div style={{ 'flexBasis': '30%', 'paddingRight': '15px' }}>

                    <label>Pregnancy entry type: <br />
                        <select value={this.state.entryType} onChange={e => this.setState({ entryType: e.target.value })}>
                            <option value='baseline'>Baseline</option>
                            <option value='followup'>Follow-up</option>
                            <option value='term'>Postpartum</option>

                        </select>
                    </label><br /><br />

                    <p style={{ 'color': 'red' }}> No recent pregnancy to associate with this entry. Please click below to add the pregnancy:</p> <br></br>
                    <p>Previous pregnancies:</p>
                    <EditPregnancy match={this.props.match} location={this.props.location} renderedInFrontPage={true} />


                </div>
                <div style={{ 'flexBasis': '70%', 'overflow': 'auto' }}>
                    {/* <PregnancyPostDataForm childRef={component => { this.pregnancyForm = component; }} renderedInFrontPage={this.props.renderedInFrontPage} /> */}
                    <div style={{ 'width': '100%' }}>
                        {this._renderSwitch(this.state.entryType)}
                    </div>
                </div>

            </div>
        )



    }
}

export default CreatePregnancyEntry;
