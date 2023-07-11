import React, { Component } from 'react';
import { examplePregnancyData } from './exampleData';
import PregnancyBaselineDataForm from './pregBaselineData';
import PregnancyPostDataForm from './pregPostData';
import PregnancyFollowupDataForm from './pregFollowupData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPregnancyDataAPICall, createPregnancyItemsCall, alterPregnancyItemsCall } from '../../redux/actions/demographicData';
import store from '../../redux/store';
import style from '../patientProfile/patientProfile.module.css';
import PregnancyImageForm from './pregImage';
import moment from 'moment';


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class CreatePregnancyEntry extends Component {
    constructor(props) {
        super();
        const { childRef } = props;
        if (childRef) {
            childRef(this);
        }

        let matchedEntry = {};
        let matchedPregnancy = {};

        const patientPregnancyEntries = props.data.pregnancyEntries;

        let visitEntry = patientPregnancyEntries.filter((el) => parseInt(el.visitId) === parseInt(props.match.params.visitId))

        if (visitEntry.length) {
            Object.assign(matchedEntry, visitEntry[0])

            const pregnanciesFiltered = props.data.pregnancy.filter((el) => el.id === visitEntry[0].pregnancyId);

            if (pregnanciesFiltered.length) {
                Object.assign(matchedPregnancy, pregnanciesFiltered[0]);
            }
        }


        this.state = {
            entryType: matchedEntry.dataType,
            formData: {},

            pregnancyId: matchedEntry.pregnancyId,
            pregnancyStartDate: matchedPregnancy.startDate ? new Date(parseFloat(matchedPregnancy.startDate)) : null,
            entryId: matchedEntry.id,
            createEntry: matchedEntry.id ? false : true


        };
        this._renderSwitch = this._renderSwitch.bind(this);
        this.pregnancyForm = null;
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._isValidDate = this._isValidDate.bind(this);

    }

    componentDidMount() {

        if (!this.state.entryId) {
            const currentVisitId = parseInt(this.props.match.params.visitId);
            const currentVisit = this.props.data.visits.filter((el) => parseInt(el.id) === currentVisitId);
            const currentVisitDate = new Date(parseFloat(currentVisit[0].visitDate));

            this._setPregnancyStatus(currentVisitDate, this.props.data.pregnancy);
            this.setState({ createEntry: true });

        }
    }


    _isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    _setPregnancyStatus(date, pregnancies) {

        const sortedPregnancies = pregnancies.sort((a, b) => {
            // Sort pregnancies in descending order based on startDate
            return new Date(parseFloat(b.startDate)) - new Date(parseFloat(a.startDate));
        });


        for (const pregnancy of sortedPregnancies) {
            const startDate = new Date(parseFloat(pregnancy.startDate));
            const outcomeDate = new Date(parseFloat(pregnancy.outcomeDate));

            if (startDate <= date && (!this._isValidDate(outcomeDate) || outcomeDate >= date)) {
                // Date falls within an ongoing pregnancy

                this.setState({
                    pregnancyStartDate: startDate,
                    pregnancyId: parseInt(pregnancy.id),
                    entryType: 'followup'
                });

                return;
            }

            if (this._isValidDate(outcomeDate) && outcomeDate < date) {
                // All pregnancies have concluded before the given date

                this.setState({
                    entryType: 'baseline'
                });

                return;
            }
        }

        // No pregnancies found
        this.setState({
            entryType: 'baseline'
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();

        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const validationErrorMessage = this.pregForm._validateFields(this.props.match.params.visitId, this.state.pregnancyId);


        if (validationErrorMessage) {
            this.setState({ error: validationErrorMessage });
            return;
        }

        const currentVisitId = parseInt(this.props.match.params.visitId);
        const currentVisit = this.props.data.visits.filter((el) => parseInt(el.id) === currentVisitId);
        const currentVisitDate = currentVisit[0].visitDate;

        var date = new Date(parseInt(currentVisitDate));

        const body = {
            patientId: this.props.data.patientId,
            data: {
                //common fields
                date: date.toISOString(),
                dataType: this.pregForm.state.dataType,
                visitId: parseInt(this.props.match.params.visitId),
                id: parseInt(this.state.entryId),
                pregnancyId: parseInt(this.state.pregnancyId),

                //entry type specific fields 
                LMP: this.pregForm.state.LMP ? this.pregForm.state.LMP.toISOString() : undefined,
                maternalAgeAtLMP: this.pregForm.state.maternalAgeAtLMP,
                maternalBMI: this.pregForm.state.maternalBMI,
                EDD: this.pregForm.state.EDD ? this.pregForm.state.EDD.toISOString() : undefined,
                ART: this.pregForm.state.ART,
                numOfFoetuses: this.pregForm.state.numOfFoetuses,
                folicAcidSuppUsed: this.pregForm.state.folicAcidSuppUsed,
                folicAcidSuppUsedStartDate: this.pregForm.state.folicAcidSuppUsedStartDate ? this.pregForm.state.folicAcidSuppUsedStartDate.toISOString() : undefined,
                illicitDrugUse: this.pregForm.state.illicitDrugUse,
            },
            pregnancy: {
                id: parseInt(this.state.pregnancyId),
                patient: parseInt(this.props.data.patientId),

            },
            createEntry: this.state.createEntry,

        };

        if (this.pregForm.state.dataType === 'baseline') {
            body.pregnancy.startDate = this.pregForm.state.startDate ? this.pregForm.state.startDate.toISOString() : null;
        }
        else {
            body.pregnancy.outcome = this.pregForm.state.dataType === 'term' && this.pregForm.state.pregnancyOutcome
                ? parseInt(this.pregForm.state.pregnancyOutcome, 10) : null;
            body.pregnancy.outcomeDate = this.pregForm.state.dataType === 'term' && this.pregForm.state.outcomeDate
                ? this.pregForm.state.outcomeDate.toISOString() : null;
        }


        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {

            store.dispatch(alterPregnancyItemsCall(body))
            this.setState({ saved: true })
        });

    }



    _handleFormSubmit(ev) {
        if (this.pregnancyForm) {
            this.pregnancyForm._handleSubmit(ev);
        }
    }

    _renderSwitch(entryType) {
        const { childRef } = this.props;
        switch (entryType) {
            case 'baseline':
                return <PregnancyBaselineDataForm
                    // childRef={childRef}
                    formRef={component => { this.pregForm = component; }}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    entryId={this.state.entryId} />;
            case 'followup':
                return <PregnancyFollowupDataForm
                    pregnancyId={this.state.pregnancyId}
                    // childRef={childRef}
                    formRef={component => { this.pregForm = component; }}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    entryId={this.state.entryId} />;

            case 'term':
                return <PregnancyFollowupDataForm
                    pregnancyId={this.state.pregnancyId}
                    // childRef={childRef}
                    formRef={component => { this.pregForm = component; }}
                    renderedInFrontPage={this.props.renderedInFrontPage}
                    entryId={this.state.entryId} />;

            // case 'term':
            //     return <PregnancyPostDataForm
            //         // childRef={childRef}
            //         formRef={component => { this.pregForm = component; }}
            //         renderedInFrontPage={this.props.renderedInFrontPage}
            //         entryId={this.state.entryId} />;
            default: return <> </>
        }
    }



    render() {


        return (
            <>
                <div
                    style={{ 'display': 'flex' }}
                >
                    <div style={{ 'flexBasis': '30%', 'paddingRight': '15px' }}>

                        {
                            this.state.entryType === 'baseline' &&
                            <p>Please enter details for a baseline pregnancy record.   </p>
                        }

                        {
                            (this.state.entryType === 'followup' || this.state.entryType === 'term') &&
                            <div>
                                <p>Current ongoing pregnancy start date: {this.state.pregnancyStartDate && this.state.pregnancyStartDate.toDateString()}. Please enter details for a follow up pregnancy record.</p>

                            </div>
                        }
                        <br /> <br />
                        <PregnancyImageForm visitId={this.props.match.params.visitId}></PregnancyImageForm>


                    </div>
                    <div style={{ 'flexBasis': '70%', 'overflow': 'auto' }}>

                        <div style={{ 'width': '100%' }}>
                            {this._renderSwitch(this.state.entryType)}
                        </div>
                    </div>



                </div>
                <div>
                    {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                    {this.state.saved ? <><button disabled style={{ cursor: 'default', backgroundColor: 'green' }}>Successfully saved!</button><br /></> : null}
                </div>
            </>
        )



    }
}

export default CreatePregnancyEntry;
