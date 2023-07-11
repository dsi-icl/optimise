import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';
import style from '../patientProfile/patientProfile.module.css';
import PregnancyFollowupDataForm from './pregFollowupData';
import { editPregnancyDataAPICall } from '../../redux/actions/demographicData';


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields,

}))
class PregnancyPostDataForm extends Component {
    constructor(props) {
        super();
        const { childRef } = props;
        if (childRef) {
            childRef(this);
        }
        this.state = {
            endDate: moment(),
            dataType: 'term',
            inductionOfDelivery: moment(),
            lengthOfPregnancy: undefined,
            pregnancyOutcome: undefined,
            congenitalAbnormality: undefined,
            modeOfDelivery: undefined,
            useOfEpidural: undefined,
            birthWeight: undefined,
            sexOfBaby: undefined,
            APGAR0: undefined,
            APGAR5: undefined,
            everBreastFed: undefined,
            breastfeedStart: moment(),
            exclusiveBreastfeedEnd: moment(),
            mixedBreastfeedEnd: moment(),
            admission12: undefined,
            admission36: undefined,
            admission60: undefined,
            developmentalOutcome: undefined,
            saved: false

        };

        this.originalValues = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    //static getDerivedStateFromProps(props, state) {
    //    if (props.match.params.ceId === state.ceId)
    //        return state;
    //    return {
    //        ...state,
    //        ceId: props.match.params.ceId,
    //        refreshReferences: true
    //    };
    //}
    //
    //componentDidUpdate() {
    //    if (this.state.refreshReferences === true) {
    //        this.references = null;
    //        this.setState({
    //            refreshReferences: false
    //        });
    //    }
    //}

    // _handleDateChange(date) {
    //     this.setState({
    //         startDate: date,
    //         error: false
    //     });
    // }

    _handleDateChange(date, field) {
        this.setState({
            [field]: date,
            error: false
        });
    }

    _handleInputChange(event, field) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [field]: value });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        console.log('pregPostData');

        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.props.formData) {
            return;
        }

        const body = {
            patientId: this.props.data.patientId,
            data: {
                id: this.props.formData.id,
                dataType: this.state.dataType,
                inductionOfDelivery: this.state.inductionOfDelivery,
                lengthOfPregnancy: this.state.lengthOfPregnancy,
                pregnancyOutcome: this.state.pregnancyOutcome,
                congenitalAbnormality: this.state.congenitalAbnormality,
                modeOfDelivery: this.state.modeOfDelivery,
                useOfEpidural: this.state.useOfEpidural,
                birthWeight: this.state.birthWeight,
                sexOfBaby: this.state.sexOfBaby,
                APGAR0: this.state.APGAR0,
                APGAR5: this.state.APGAR5,
                everBreastFed: this.state.everBreastFed,
                breastfeedStart: this.state.breastfeedStart,
                exclusiveBreastfeedEnd: this.state.exclusiveBreastfeedEnd,
                mixedBreastfeedEnd: this.state.mixedBreastfeedEnd,
                admission12: this.state.admission12,
                admission36: this.state.admission36,
                admission60: this.state.admission60,
                developmentalOutcome: this.state.developmentalOutcome,
            }

        };

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyDataAPICall(body));
            //this.setState({ addMore: false });
            this.setState({ saved: true })
        });
    }

    render() {
        return (
            <>
                {
                    this.props.renderedInFrontPage ?
                        null :
                        <div className={style.ariane}>
                            <h2>Edit postpartum record</h2>
                        </div>
                }
                <div className={this.props.renderedInFrontPage ? null : style.panel}>
                    <label>Pregnancy end date: <PickDate startDate={this.state.endDate} handleChange={(date) => this._handleDateChange(date, 'endDate')} /></label><br /><br />

                    <label>Induction of delivery:
                        <select value={this.state.inductionOfDelivery} onChange={(event) =>
                            this.setState({ inductionOfDelivery: event.target.value })
                        }>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Length of pregnancy in weeks:
                        <input value={this.state.lengthOfPregnancy} onChange={(event) => this._handleInputChange(event, 'lengthOfPregnancy')} />
                    </label><br /><br />

                    <label>Pregnancy outcome<br />
                        <select value={this.state.pregnancyOutcome} onChange={(event) => this._handleInputChange(event, 'pregnancyOutcome')}>
                            <option value='ongoing'>None</option>
                            <option value='term_delivery_healthy'>Term delivery healthy (&gt; 37 weeks)</option>
                            <option value='preterm_delivery_healthy'>Pre-term delivery healthy (&lt; 37 weeks)</option>
                            <option value='term_delivery_with_congenital_abnormality'>Term delivery with congenital abnormality (37 weeks)</option>
                            <option value='preterm_delivery_with_congenital_abnormality'>Pre-Term delivery with congenital abnormality (37 weeks)</option>
                            <option value='miscarrage_lt_20weeks'>Miscarriage (20weeks)</option>
                            <option value='miscarrage_gt_20weeks'>Miscarriages (20weeks)</option>
                            <option value='ectopic'>Ectopic Pregnancy</option>
                            <option value='elective_termination'>Elective Termination</option>
                            <option value='Neonatal death'>Neonatal death</option>
                        </select>
                    </label><br /><br />

                    <label>Congenital Abnormality (EUROCAT):
                        <select value={this.state.congenitalAbnormality} onChange={(event) => this._handleInputChange(event, 'congenitalAbnormality')}>
                            <option value='none'>None</option>
                            <option value='unknown'>Unknown</option>
                            <option value='amniotic_bands'>Amniotic bands</option>
                            <option value='anal_atresia_stenosis'>Anal atresia / stenosis</option>
                            <option value='anencephaly'>Anencephaly</option>
                            <option value='cerebral_palsy'>Cerebral Palsy</option>
                            <option value='chromosomal_defect_others'>Chromosomal defect - others</option>
                            <option value='cleft_lip_w/o_cleft_palate'>Cleft lip w/o cleft palate</option>
                            <option value='cleft_palate_only'>Cleft plate only</option>
                            <option value='clubfoot'>Club foot</option>
                            <option value='coarctation_of_aorta'>Coarctation of the aorta</option>
                            <option value='craniosynostosis'>Craniosynostosis</option>
                            <option value='cystic_kidney_disease'>Cystic kidney disease</option>
                            <option value='diaphragmatic_hernia'>Diaphragmatic hernia</option>
                            <option value='downs_syndrome'>Down syndrome (Trisomy 21)</option>
                            <option value='encephalocele'>Encephalocele</option>
                            <option value='endocardial_cushion_defect'>Endocardial cushion defect</option>
                            <option value='extra_or_horseshoe_kidney'>Extra or horseshoe kidney</option>
                            <option value='gastroschisis'>Gastroschisis</option>
                            <option value='hypospadias'>Hypospadias</option>
                            <option value='inguinal_hernia'>Inguinal hernia</option>
                            <option value='limb_reduction_defects'>Limb reduction defect</option>
                            <option value='metabolic_disorders'>Metabolic disorders</option>
                            <option value='neural_tube_defects'>Neural tube defects</option>
                            <option value='omphalocele'>Omphalocele</option>
                            <option value='polydactyly'>Polydactyly</option>
                            <option value='pyloric_stenosis'>Pyloric stenosis</option>
                            <option value='renal_agenesis_dysgenesis'>Renal agenesis & dysgenesis</option>
                            <option value='renal_collecting_system_anomalies'>Renal collecting system anomalies</option>
                            <option value='small_intestinal_artesisa_stenosis'>Small intestinal artesia / stenosis</option>
                            <option value='spina_bifida'>Spina bifida</option>
                            <option value='tracheo_esophageal_fistula'>Tracheo-esophageal fistula</option>
                            <option value='undescended_testicle'>Undescended testicle</option>
                            <option value='ventricular_septal_defect'>Ventricular septal defect</option>
                            <option value='other'>other</option>
                        </select>
                    </label><br /><br />

                    <label>Mode of delivery:
                        <select value={this.state.modeOfDelivery} onChange={(event) => this._handleInputChange(event, 'modeOfDelivery')}>
                            <option value='vaginal'>Vaginal</option>
                            <option value='forceps_assisted'>Forceps assisted</option>
                            <option value='ventouse_assisted'>Ventouse assisted</option>
                            <option value='emergency_caesarean'>Emergency caesarean</option>
                            <option value='elective_caesarean'>Elective caesarean</option>
                        </select>
                    </label><br /><br />

                    <label>Use of epidural anaesthesia during delivery:
                        <select value={this.state.useOfEpidural} onChange={(event) => this._handleInputChange(event, 'useOfEpidural')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Birth weight: <input value={this.state.birthWeight} onChange={(event) => this._handleInputChange(event, 'birthWeight')} /></label><br /><br />

                    <label>Sex of baby:
                        <select value={this.state.sexOfBaby} onChange={(event) => this._handleInputChange(event, 'sexOfBaby')}>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                        </select>
                    </label><br /><br />

                    <label>APGAR at 0 min:
                        <input value={this.state.APGAR0} onChange={(event) => this._handleInputChange(event, 'APGAR0')} />
                    </label><br /><br />

                    <label>APGAR at 5 min:
                        <input value={this.state.APGAR5} onChange={(event) => this._handleInputChange(event, 'APGAR5')} />
                    </label><br /><br />

                    <label>Any breastfeeding / ever breastfed:
                        <select value={this.state.everBreastFed} onChange={(event) => this._handleInputChange(event, 'everBreastFed')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Breastfeeding start date:
                        <PickDate startDate={this.state.breastfeedStart} handleChange={(date) => this._handleDateChange(date, 'breastfeedStart')} />
                    </label><br /><br />

                    <label>Exclusive Breastfeeding end date:
                        <PickDate startDate={this.state.exclusiveBreastfeedEnd} handleChange={(date) => this._handleDateChange(date, 'exclusiveBreastfeedEnd')} />
                    </label><br /><br />

                    <label>Mix-breastfeeding end date:
                        <PickDate startDate={this.state.mixedBreastfeedEnd} handleChange={(date) => this._handleDateChange(date, 'mixedBreastfeedEnd')} />
                    </label><br /><br />

                    <label>Hospital admission of infant within 1 year of life:
                        <select value={this.state.admission12} onChange={(event) => this._handleInputChange(event, 'admission12')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Hospital admission of infant within 36 months of life:
                        <select value={this.state.admission36} onChange={(event) => this._handleInputChange(event, 'admission36')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Hospital admission of infant within 60 months of life:
                        <select value={this.state.admission60} onChange={(event) => this._handleInputChange(event, 'admission60')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </label><br /><br />

                    <label>Developmental outcomes during the first 5 years of life:
                        <select value={this.state.developmentalOutcome} onChange={(event) => this._handleInputChange(event, 'developmentalOutcome')}>
                            <option value='none'>None</option>
                            <option value='developmental_delays'>Formally diagnosed developmental delays</option>
                            <option value='neuropsychiatric'>Formally diagnosed neuropsychiatric outcomes</option>
                        </select>
                    </label><br /><br />
                    {this.props.renderedInFrontPage ? null :
                        <button type='submit'>Save</button>
                    }
                </div>
            </>);
    }
}

export default PregnancyPostDataForm;
