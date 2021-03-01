import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PatientProfileSectionScaffold, DeleteButton, EditButton, PatientProfileTop } from '../patientProfile/sharedComponents';
import { withRouter, Link } from 'react-router-dom';
import { examplePregnancyData } from './exampleData';
import Helmet from '../scaffold/helmet';
import style from '../patientProfile/patientProfile.module.css';
import pregstyle from './pregnancy.module.css';

@withRouter
@connect(state => ({
    outcomeHash: state.availableFields.pregnancyOutcomes_Hash[0],
    data: state.patientProfile.data,
    meddra_Hash: state.availableFields.meddra_Hash[0]
}))
export class PregnancyList extends Component {
    render() {
        //
        //    if (this.props.data.demographicData) {
        //        if (this.props.data.demographicData.gender === 1)
        //            return 'Pregnancy data are only recorded for female patients.';
        //    }
        //
        //    const PregnancyListButton = <NavLink to={`/patientProfile/${this.props.data.patientId}/pregnancies`}><button>Edit data</button></NavLink>;
        //
        //    if (this.props.data.demographicData) {
        //        if (this.props.data.pregnancy.length === 0) {
        //            return (
        //                <PatientProfileSectionScaffold sectionName='Last Pregnancy' actions={
        //                    <EditButton to={`/patientProfile/${this.props.data.patientId}/edit/pregnancy/data`} />
        //                }>
        //                <i>No recorded pregnancy</i>
        //                {PregnancyListButton}
        //                </PatientProfileSectionScaffold>
        //            );
        //        }
        //    }
        //
        //    const pregnancy = this.props.data.pregnancy.sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))[0];
        //    if (!pregnancy) {
        //        return null;
        //    }
        //
        //    const outcomeName = this.props.outcomeHash[pregnancy.outcome];
        //    const MedDRAName = this.props.meddra_Hash[pregnancy.meddra];
        //
        //    return (
        //        <PatientProfileSectionScaffold sectionName='Last Pregnancy' actions={
        //            <EditButton to={`/patientProfile/${this.props.data.patientId}/edit/pregnancy/data`} />
        //        }>
        //        <>
        //        {PregnancyListButton}
        //        <label>Start dateee: </label> {moment(pregnancy.startDate, 'x')._d.toDateString()}
        //        {pregnancy.outcomeDate && pregnancy.outcomeDate !== '' ? <> <br /><label>End date: </label> {moment(pregnancy.outcomeDate, 'x')._d.toDateString()}</> : null}
        //        {outcomeName ? <> <br /><label>Outcome: </label> {outcomeName}</> : null}
        //        {MedDRAName ? <> <br /><label>MedDRA: </label> {MedDRAName.name}</> : null}
        //        </>
        //        </PatientProfileSectionScaffold>
        //    );
        //}
        const data = examplePregnancyData;

        return (
            <>
            <div className={style.ariane}>
            <Helmet title='Patient Profile' />
            <h2><Link to={`/patientProfile/${this.props.match.params.patientId}`}>Patient {this.props.fetching ? '' : `${this.props.data.patientId}`}</Link></h2>
            <PatientProfileTop />
            </div>

            <div className={`${style.panel} ${style.patientHistory}`}>
            {/* this.props.fetching ? <div><Icon symbol='loading' /></div> */}
            <PatientProfileSectionScaffold sectionName='Pregnancies' >
            {
                data.map(el => <OnePregnancy key={el.id} data={el}/>)
            }
            </PatientProfileSectionScaffold>
            </div>
            </>

        );
    }
}

class OnePregnancy extends Component {
    render() {
        const { data } = this.props;
        return (
            <div className={pregstyle.one_pregnancy_wrapper}>
            <label>Start date:</label> <span>{ new Date(parseInt(data.startDate)).toDateString()}</span><br/>
            { data.dataEntries.map(el => <OneDataEntry key={el.id} data={el}/>) }
            </div>
        );
    }
}

class OneDataEntry extends Component {
    render() {
        const { data } = this.props;
        switch (data.dataType) {
            case 'baseline':
                return <OneDataEntryBaseline data={data}/>;
            case 'followup':
                return <OneDataEntryFollowup data={data}/>;
            case 'term':
                return <OneDataEntryTerm data={data}/>;
        }
    }
}


class OneImage extends Component {
    render() {
        const { data } = this.props;
        return (
            <div>
            <label>Image date:</label> <span>{ data.date }</span><br/>
            <label>Mode</label> <span>{ data.mode }</span><br/>
            <label>Result</label> <span>{ data.result }</span><br/>
            </div>
        );
    }
}

class OneDataEntryBaseline extends Component {
    render() {
        const { data } = this.props;
        return (
            <div>
            <Link to={`/patientProfile/fdsa/editPregnancyDataEntry/${data.id}`}>Edit this baseline record</Link><br/><br/>
            <label>BASELINE RECORD on </label> <span>{ new Date(parseInt(data.date)).toDateString() }</span><br/>
            <label>Last menstrual period (LMP):</label> <span>{ data.LMP }</span><br/>
            <label>Maternal age at LMP:</label> <span>{ data.maternalAgeAtLMP}</span><br/>
            <label>Estimated delivery date:</label> <span>{ new Date(parseInt(data.EDD)).toDateString() }</span><br/>
            <label>Assisted Reproductive Technology method:</label> <span>{ data.ART }</span><br/>
            <label>Number of foetuses:</label> <span>{ data.numOfFoetuses }</span><br/>
            <label>Folic acid suppliment:</label> <span>{ data.folicAcidSuppUsed }</span><br/>
            {
                data.folicAcidSuppUsed === 'yes'
                ?
                <>
                <label>Folic acid suppliment start date:</label> <span>{ data.folicAcidSuppUsedStartDate }</span><br/>
                </>
                :
                null
            }
            <label>Illicit drug use:</label> <span>{ data.illicitDrugUse}</span><br/>

            { data.imaging.map(el => <OneImage key={el.id} data={el}/>) }
            </div>
        );
    }
}

class OneDataEntryFollowup extends Component {
    render() {
        const { data } = this.props;
        return (
            <div>
            <Link to={`/patientProfile/fdsa/editPregnancyDataEntry/${data.id}`}>Edit this followup record</Link><br/><br/>
            <label>FOLLOWUP RECORD on </label> <span>{ data.date }</span><br/>
            <label>Estimated delivery date:</label> <span>{ data.EDD }</span><br/>
            <label>Number of foetuses:</label> <span>{ data.numOfFoetuses }</span><br/>
            <label>Folic acid suppliment:</label> <span>{ data.folicAcidSuppUsed }</span><br/>
            {
                data.folicAcidSuppUsed === 'yes'
                ?
                <>
                <label>Folic acid suppliment start date:</label> <span>{ data.folicAcidSuppUsedStartDate }</span><br/>
                </>
                :
                null
            }
            <label>Illicit drug use:</label> <span>{ data.illicitDrugUse}</span><br/>

            { data.imaging.map(el => <OneImage key={el.id} data={el}/>) }
            </div>
        );
    }
}

class OneDataEntryTerm extends Component {
    render() {
        const { data } = this.props;
        return (
            <div>
            <Link to={`/patientProfile/fdsa/editPregnancyDataEntry/${data.id}`}>Edit this postpartum record</Link><br/><br/>
            <label>POSTPARTUM RECORD on </label> <span>{ data.date }</span><br/>
            <label>Induction of Delivery:</label><span>{data.inductionOfDelivery}</span><br/>
            <label>Length of pregnancy in weeks:</label><span>{data.lengthOfPregnancy}</span><br/>
            <label>Pregnancy outcome:</label><span>{data.pregnancyOutcome}</span><br/>
            <label>Congenital Abnormality:</label><span>{data.congenitalAbnormality}</span><br/>
            <label>Mode of delivery:</label><span>{data.modeOfDelivery}</span><br/>
            <label>Use of Epidural:</label><span>{data.useOfEpidural}</span><br/>
            <label>Birth weight:</label><span>{data.birthWeight}</span><br/>
            <label>Sex of baby:</label><span>{data.sexOfBaby}</span><br/>
            <label>APGAR at 0 min:</label><span>{data.APGAR0}</span><br/>
            <label>APGAR at 5 min:</label><span>{data.APGAR5}</span><br/>
            <label>Ever breastfed?:</label><span>{data.everBreastFed}</span><br/>
            <label>Breastfeed start:</label><span>{data.breastfeedStart}</span><br/>
            <label>Exclusive breastfeed end date:</label><span>{data.exclusiveBreastfeedEnd}</span><br/>
            <label>Mixed breastfeed end date:</label><span>{data.mixedBreastfeedEnd}</span><br/>
            <label>Baby admission to hospital within 12 months:</label><span>{data.admission12}</span><br/>
            <label>Baby admission to hospital within 36 months:</label><span>{data.admission36}</span><br/>
            <label>Baby admission to hospital within 60 months:</label><span>{data.admission60}</span><br/>
            <label>Developmental outcome:</label><span>{data.developmentalOutcome}</span><br/>
            </div>
        );
    }
}
