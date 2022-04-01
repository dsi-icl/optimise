import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { alterDataCall } from '../../redux/actions/addOrUpdateData';
//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
//import style from './dataPage.module.css';
//import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';
import style from '../patientProfile/patientProfile.module.css';
import { apiHelper } from '../../redux/fetchHelper';
import { getPatientProfileById } from '../../redux/actions/searchPatient';
import store from '../../redux/store';

function mapStateToProps(state) {
    return {
        patientProfile: state.patientProfile,
    };
}
@withRouter
@connect(mapStateToProps)
export class PregnancyPostDataForm extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            EDD: moment(), //estimated delivery date
            inductionOfDelivery: 'yes',
            pregnancyOutcome: 'ongoing',
            congenitalAbnormality: 'none',
            modeOfDelivery: 'vaginal',
            useOfEpidural: 'yes',
            birthWeight: '',
            sexOfBaby: 'male',
            APGAR0: '',
            APGAR5: '',
            everBreastFed: 'yes',
            breastFeedStartDate: null,
            exclusiveBreastfeedEnd: null,
            mixedBreastfeedEnd: null,
            admission12: 'yes',
            admission36: 'yes',
            admission60: 'yes',
            developmentalOutcome: 'none',
        };
        this.originalValues = {};
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: false,
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    _handleDateChangeBreastFeedStart = (e) => {
        this.setState({
            breastFeedStartDate: e,
        });
    };

    _handleDateChangeExclusiveBreastfeedEnd = (e) => {
        this.setState({
            exclusiveBreastfeedEnd: e,
        });
    };

    _handleDateChangeMixedBreastfeedEnd = (e) => {
        this.setState({
            mixedBreastfeedEnd: e,
        });
    };

    handleSave = async (e) => {
        const patientId = this.props.match.params.patientId;
        const pregnancyId = this.props.match.params.pregnancyId;

        console.log(this.state);

        const requiredFields = [
            'EDD',
            'inductionOfDelivery',
            'pregnancyOutcome',
            'congenitalAbnormality',
            'modeOfDelivery',
            'useOfEpidural',
            'birthWeight',
            'sexOfBaby',
            'APGAR0',
            'APGAR5',
            'everBreastFed',
            'breastFeedStartDate',
            'exclusiveBreastfeedEnd',
            'mixedBreastfeedEnd',
            'admission12',
            'admission36',
            'admission60',
            'developmentalOutcome',
        ];

        for (let item of requiredFields) {
            if (!this.state[item]) {
                this.setState({ error: true });
                return;
            }
        }

        const pregnancyData = {
            EDD: this.state.EDD.toISOString(),
            inductionOfDelivery: this.state.inductionOfDelivery,
            pregnancyOutcome: this.state.pregnancyOutcome,
            congenitalAbnormality: this.state.congenitalAbnormality,
            modeOfDelivery: this.state.modeOfDelivery,
            useOfEpidural: this.state.useOfEpidural,
            birthWeight: this.state.birthWeight,
            sexOfBaby: this.state.sexOfBaby,
            APGAR0: this.state.APGAR0,
            APGAR5: this.state.APGAR5,
            everBreastFed: this.state.everBreastFed,
            breastFeedStartDate: this.state.breastFeedStartDate
                ? this.state.breastFeedStartDate.toISOString()
                : null,
            exclusiveBreastfeedEnd: this.state.exclusiveBreastfeedEnd
                ? this.state.exclusiveBreastfeedEnd.toISOString()
                : null,
            mixedBreastfeedEnd: this.state.mixedBreastfeedEnd
                ? this.state.mixedBreastfeedEnd.toISOString()
                : null,
            admission12: this.state.admission12,
            admission36: this.state.admission36,
            admission60: this.state.admission60,
            developmentalOutcome: this.state.developmentalOutcome,
            dataType: 'term',
        };

        await apiHelper(`/pregnancy/${patientId}/${pregnancyId}`, {
            method: 'POST',
            body: JSON.stringify(pregnancyData),
        });

        store.dispatch(getPatientProfileById(patientId));
    };

    render() {
        return (
            <>
                {this.props.renderedInFrontPage ? null : (
                    <div className={style.ariane}>
                        <h2>Edit postpartum record</h2>
                    </div>
                )}
                <div className={style.panel}>
                    <label>
                        Pregnancy end date:{' '}
                        <PickDate
                            startDate={this.state.EDD}
                            handleChange={this._handleDateChange}
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Induction of delivery:
                        <select
                            onChange={this.handleChange}
                            value={this.state.inductionOfDelivery}
                            name="inductionOfDelivery"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Length of pregnancy in weeks:
                        <input
                            onChange={this.handleChange}
                            value={this.state.lengthOfPregnancy}
                            name="lengthOfPregnancy"
                            type="number"
                        />
                    </label>

                    <label>
                        Pregnancy outcome
                        <br />
                        <select
                            name="pregnancyOutcome"
                            onChange={this.handleChange}
                            value={this.state.pregnancyOutcome}
                        >
                            <option value="ongoing">None</option>
                            <option value="term_delivery_healthy">
                                Term delivery healthy (&gt; 37 weeks)
                            </option>
                            <option value="preterm_delivery_healthy">
                                Pre-term delivery healthy (&lt; 37 weeks)
                            </option>
                            <option value="term_delivery_with_congenital_abnormality">
                                Term delivery with congenital abnormality (37
                                weeks)
                            </option>
                            <option value="preterm_delivery_with_congenital_abnormality">
                                Pre-Term delivery with congenital abnormality
                                (37 weeks)
                            </option>
                            <option value="miscarrage_lt_20weeks">
                                Miscarriage (20weeks)
                            </option>
                            <option value="miscarrage_gt_20weeks">
                                Miscarriages (20weeks)
                            </option>
                            <option value="ectopic">Ectopic Pregnancy</option>
                            <option value="elective_termination">
                                Elective Termination
                            </option>
                            <option value="Neonatal death">
                                Neonatal death
                            </option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Congenital Abnormality (EUROCAT):
                        <select
                            value={this.state.congenitalAbnormality}
                            name="congenitalAbnormality"
                            onChange={this.handleChange}
                        >
                            <option value="none">None</option>
                            <option value="unknown">Unknown</option>
                            <option value="amniotic_bands">
                                Amniotic bands
                            </option>
                            <option value="anal_atresia_stenosis">
                                Anal atresia / stenosis
                            </option>
                            <option value="anencephaly">Anencephaly</option>
                            <option value="cerebral_palsy">
                                Cerebral Palsy
                            </option>
                            <option value="chromosomal_defect_others">
                                Chromosomal defect - others
                            </option>
                            <option value="cleft_lip_w/o_cleft_palate">
                                Cleft lip w/o cleft palate
                            </option>
                            <option value="cleft_palate_only">
                                Cleft plate only
                            </option>
                            <option value="clubfoot">Club foot</option>
                            <option value="coarctation_of_aorta">
                                Coarctation of the aorta
                            </option>
                            <option value="craniosynostosis">
                                Craniosynostosis
                            </option>
                            <option value="cystic_kidney_disease">
                                Cystic kidney disease
                            </option>
                            <option value="diaphragmatic_hernia">
                                Diaphragmatic hernia
                            </option>
                            <option value="downs_syndrome">
                                Down syndrome (Trisomy 21)
                            </option>
                            <option value="encephalocele">Encephalocele</option>
                            <option value="endocardial_cushion_defect">
                                Endocardial cushion defect
                            </option>
                            <option value="extra_or_horseshoe_kidney">
                                Extra or horseshoe kidney
                            </option>
                            <option value="gastroschisis">Gastroschisis</option>
                            <option value="hypospadias">Hypospadias</option>
                            <option value="inguinal_hernia">
                                Inguinal hernia
                            </option>
                            <option value="limb_reduction_defects">
                                Limb reduction defect
                            </option>
                            <option value="metabolic_disorders">
                                Metabolic disorders
                            </option>
                            <option value="neural_tube_defects">
                                Neural tube defects
                            </option>
                            <option value="omphalocele">Omphalocele</option>
                            <option value="polydactyly">Polydactyly</option>
                            <option value="pyloric_stenosis">
                                Pyloric stenosis
                            </option>
                            <option value="renal_agenesis_dysgenesis">
                                Renal agenesis & dysgenesis
                            </option>
                            <option value="renal_collecting_system_anomalies">
                                Renal collecting system anomalies
                            </option>
                            <option value="small_intestinal_artesisa_stenosis">
                                Small intestinal artesia / stenosis
                            </option>
                            <option value="spina_bifida">Spina bifida</option>
                            <option value="tracheo_esophageal_fistula">
                                Tracheo-esophageal fistula
                            </option>
                            <option value="undescended_testicle">
                                Undescended testicle
                            </option>
                            <option value="ventricular_septal_defect">
                                Ventricular septal defect
                            </option>
                            <option value="other">other</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Mode of delivery:
                        <select
                            value={this.state.modeOfDelivery}
                            name="modeOfDelivery"
                            onChange={this.handleChange}
                        >
                            <option value="vaginal">Vaginal</option>
                            <option value="forceps_assisted">
                                Forceps assisted
                            </option>
                            <option value="ventouse_assisted">
                                Ventouse assisted
                            </option>
                            <option value="emergency_caesarean">
                                Emergency caesarean
                            </option>
                            <option value="elective_caesarean">
                                Elective caesarean
                            </option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Use of epidural anaesthesia during delivery:
                        <select
                            value={this.state.useOfEpidural}
                            name="useOfEpidural"
                            onChange={this.handleChange}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Birth weight:
                        <input
                            value={this.state.birthWeight}
                            name="birthWeight"
                            onChange={this.handleChange}
                            type="number"
                        />
                    </label>
                    <br />
                    <br />

                    <label>
                        Sex of baby:
                        <select
                            value={this.state.sexOfBaby}
                            name="sexOfBaby"
                            onChange={this.handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>
                    <br />

                    <label>
                        APGAR at 0 min:
                        <input
                            name="APGAR0"
                            value={this.state.APGAR0}
                            onChange={this.handleChange}
                        />
                    </label>

                    <label>
                        APGAR at 5 min:
                        <input
                            name="APGAR5"
                            value={this.state.APGAR5}
                            onChange={this.handleChange}
                        />
                    </label>

                    <label>
                        Any breastfeeding / ever breastfed:
                        <select
                            value={this.state.everBreastFed}
                            name="everBreastFed"
                            onChange={this.handleChange}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Breastfeeding start date:
                        <PickDate
                            startDate={this.state.breastfeedStart}
                            handleChange={this._handleDateChangeBreastFeedStart}
                        />
                    </label>
                    <br />

                    <label>
                        Exclusive Breastfeeding end date:
                        <PickDate
                            startDate={this.state.exclusiveBreastfeedEnd}
                            handleChange={
                                this._handleDateChangeExclusiveBreastfeedEnd
                            }
                        />
                    </label>
                    <br />

                    <label>
                        Mix-breastfeeding end date:
                        <PickDate
                            startDate={this.state.mixedBreastfeedEnd}
                            handleChange={
                                this._handleDateChangeMixedBreastfeedEnd
                            }
                        />
                    </label>
                    <br />

                    <label>
                        Hospital admission of infant within 1 year of life:
                        <select
                            value={this.state.admission12}
                            onChange={this.handleChange}
                            name="admission12"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Hospital admission of infant within 36 months of life:
                        <select
                            value={this.state.admission36}
                            onChange={this.handleChange}
                            name="admission36"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Hospital admission of infant within 60 months of life:
                        <select
                            value={this.state.admission60}
                            onChange={this.handleChange}
                            name="admission60"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <br />
                    <br />

                    <label>
                        Developmental outcomes during the first 5 years of life:
                        <select
                            value={this.state.developmentalOutcome}
                            onChange={this.handleChange}
                            name="developmentalOutcome"
                        >
                            <option value="none">None</option>
                            <option value="developmental_delays">
                                Formally diagnosed developmental delays
                            </option>
                            <option value="neuropsychiatric">
                                Formally diagnosed neuropsychiatric outcomes
                            </option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <button onClick={this.handleSave}>Save</button>
                    {this.state.error ? (
                        <>
                            <div className={style.error}>
                                None of the fields can be empty!
                            </div>
                            <br />
                            <br />
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}
