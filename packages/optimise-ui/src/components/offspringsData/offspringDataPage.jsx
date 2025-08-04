import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { BackButton } from './utils';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './offspringPage.module.css';
import store from '../../redux/store';
import { editOffspringAPICall } from '../../redux/actions/demographicData';

const OffspringData = ({
    match
}) => {
    const { patientProfile: { fetching, currentPatient, data } } = useSelector(state => state);
    const { offsprings = [], pregnancy: pregnancies = [], patientId } = data;
    const offspring = offsprings.find(offspring => offspring.id === parseInt(match.params.offspringId, 10));
    const pregnancy = pregnancies.find(pregnancy => pregnancy.id === offspring?.pregnancyId);
    const [offpringData, setOffpringData] = useState(null);
    const [__unusedLastSubmit, setLastSubmit] = useState(null);
    const [__unusedSaved, setSaved] = useState(false);
    const atDeliveryOutcome = pregnancy?.outcome !== null;
    const pregnancyLengthInWeeks = moment(parseInt(pregnancy?.outcomeDate ?? '0')).diff(moment(parseInt(pregnancy?.startDate ?? '0')), 'weeks');

    useEffect(() => {
        try {
            if (fetching)
                return;
            if (offpringData === null && offspring?.data)
                setOffpringData(JSON.parse(offspring?.data));
        }
        catch (__unusedError) {
            // ignore
        }
    }, [fetching, offpringData, offspring]);

    const _handleNameChange = (event) => {
        offpringData.name = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleGenderChange = (event) => {
        offpringData.gender = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleWeigthChange = (event) => {
        offpringData.weight = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleHeigthChange = (event) => {
        offpringData.height = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleAPGAR1Change = (event) => {
        offpringData.apgar1 = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleAPGAR5Change = (event) => {
        offpringData.apgar5 = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleCongenitalAffectMinorChange = (event) => {
        offpringData.congenitalAffectMinor = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleCongenitalAffectMajorChange = (event) => {
        offpringData.congenitalAffectMajor = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleFeedingModeChange = (event) => {
        offpringData.feedingMode = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleBreastFeedingChange = (event) => {
        offpringData.breastFeedingDuration = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleHospitalAdmissionFirstYearChange = (event) => {
        offpringData.hospitalAdmissionFirstYear = event.target.checked;
        setOffpringData({ ...offpringData });
    };
    const _handleDevelopmentalOutcomesChange = (event) => {
        offpringData.developmentalOutcomes = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _handleNeonatalDeathChange = (event) => {
        offpringData.neonatalDeath = event.target.checked;
        if (event.target.checked === false)
            offpringData.neonatalDeathReason = undefined;
        setOffpringData({ ...offpringData });
    };

    const _handleNeonatalDeathReasonChange = (event) => {
        offpringData.neonatalDeathReason = event.target.value;
        setOffpringData({ ...offpringData });
    };

    const _textareaAutosize = (event) => {
        var el = event.target;
        setTimeout(function () {
            el.style.cssText = 'min-height:37px; height: 37px;';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    };

    const _handleSubmit = (e) => {
        e.preventDefault();

        const body = {
            patientId,
            data: {
                id: offspring.id,
                data: JSON.stringify(offpringData)
            }
        };
        setLastSubmit((new Date()).getTime());
        store.dispatch(editOffspringAPICall(body, () => {
            setSaved(true);
        }));

        return false;
    };

    if (fetching || !offspring || !pregnancy || !offpringData)
        return <>
            <div className={scaffold_style.ariane}>
                <h2>EDIT OFFSPRING DATA</h2>
                <BackButton to={`/patientProfile/${currentPatient}/offsprings`} />
            </div>
            <div className={scaffold_style.panel}>
                <i>We are loading the data...</i>
            </div>
        </>;

    if (!offsprings.length)
        return <>
            <div className={scaffold_style.ariane}>
                <h2>EDIT OFFSPRING DATA</h2>
                <BackButton to={`/patientProfile/${currentPatient}/offsprings`} />
            </div>
            <div className={scaffold_style.panel}>
                <i>We could not find the event that you are looking for.</i>
            </div>
        </>;

    return <>
        <div className={scaffold_style.ariane}>
            <h2>
                EDIT OFFSPRING DATA (
                {offpringData.name ?? `ID${offspring.id}`}
                )
            </h2>
            <BackButton to={`/patientProfile/${currentPatient}/offsprings`} />
        </div>
        <div className={scaffold_style.panel}>
            <label htmlFor="weight">Name</label>
            <input name="weight" defaultValue={offpringData.name} onChange={_handleNameChange} />
            {pregnancyLengthInWeeks > 1 && pregnancyLengthInWeeks < 36
                ? <>
                    <br />
                    <br />
                    <i>
                        This offspring was born preterm (at
                        {pregnancyLengthInWeeks}
                        {' '}
                        weeks).
                    </i>
                </>
                : pregnancyLengthInWeeks > 36
                    ? <>
                        <br />
                        <br />
                        <i>
                            This offspring was born past term (at
                            {pregnancyLengthInWeeks}
                            {' '}
                            weeks).
                        </i>
                    </>
                    : null}
            <br />
            <br />
            <label>Gender</label>
            <select defaultValue={offpringData.gender} onChange={_handleGenderChange}>
                <option value="unselected"></option>
                <option value="male">Boy</option>
                <option value="female">Girl</option>
            </select>
            {atDeliveryOutcome
                ? <>
                    <br />
                    <br />
                    <label htmlFor="weight">Weight of infant at delivery</label>
                    <input name="weight" defaultValue={offpringData.weight} onChange={_handleWeigthChange} />
                    <br />
                    <br />
                    <label htmlFor="height">Height of infant at delivery</label>
                    <input name="height" defaultValue={offpringData.height} onChange={_handleHeigthChange} />
                    <br />
                    <br />
                    <label htmlFor="apgar1">APGAR score at 1 minute</label>
                    <input name="apgar1" defaultValue={offpringData.apgar1} onChange={_handleAPGAR1Change} />
                    <br />
                    <br />
                    <label htmlFor="apgar5">APGAR score at 5 minutes</label>
                    <input name="apgar5" defaultValue={offpringData.apgar5} onChange={_handleAPGAR5Change} />
                    <br />
                    <br />
                    <label htmlFor="congenitalAffectMinor">
                        Presence of
                        <u style={{ textDecoration: 'underline' }}>minor</u>
                        {' '}
                        congential malformations (EUROCAT)
                    </label>
                    <textarea className={style.expandingTextarea} name="congenitalAffectMinor" defaultValue={offpringData.congenitalAffectMinor} onMouseEnter={_textareaAutosize} onKeyDown={_textareaAutosize} onChange={_handleCongenitalAffectMinorChange}></textarea>
                    <br />
                    <br />
                    <label htmlFor="congenitalAffectMajor">
                        Presence of
                        <u style={{ textDecoration: 'underline' }}>major</u>
                        {' '}
                        congential malformations (EUROCAT)
                    </label>
                    <textarea className={style.expandingTextarea} name="congenitalAffectMajor" defaultValue={offpringData.congenitalAffectMajor} onMouseEnter={_textareaAutosize} onKeyDown={_textareaAutosize} onChange={_handleCongenitalAffectMajorChange}></textarea>
                    <br />
                    <br />
                    <label htmlFor="feedingMode">Mode of infant feeding</label>
                    <select name="feedingMode" defaultValue={offpringData.feedingMode} onChange={_handleFeedingModeChange}>
                        <option value="unselected"></option>
                        <option value="breastfeeding">Breastfeeding</option>
                        <option value="formula">Formula</option>
                        <option value="mixed">Mixed</option>
                    </select>
                    <br />
                    <br />
                    <label htmlFor="breastFeedingDuration">Duration of breastfeeding</label>
                    <input name="breastFeedingDuration" defaultValue={offpringData.breastFeedingDuration} onChange={_handleBreastFeedingChange} />
                    <br />
                    <br />
                    <label htmlFor="hospitalAdmissionFirstYear">Admission of infant to hospital within the first year of life</label>
                    <input name="hospitalAdmissionFirstYear" type="checkbox" checked={offpringData.hospitalAdmissionFirstYear} onChange={_handleHospitalAdmissionFirstYearChange} />
                    <br />
                    <br />
                    <label htmlFor="neonatalDeath">Neonatal death in first 4 weeks of life</label>
                    <input name="neonatalDeath" type="checkbox" checked={offpringData.neonatalDeath} onChange={_handleNeonatalDeathChange} />
                    <br />
                    <br />
                    {offpringData.neonatalDeath === true
                        ? <>
                            <label htmlFor="neonatalDeathReason">Cause of neonatal death</label>
                            <textarea className={style.expandingTextarea} name="neonatalDeathReason" defaultValue={offpringData.neonatalDeathReason} onMouseEnter={_textareaAutosize} onKeyDown={_textareaAutosize} onChange={_handleNeonatalDeathReasonChange}></textarea>
                            <br />
                            <br />
                        </>
                        : null}
                    <label htmlFor="developmentalOutcomes">Developmental outcomes during the first 5 years of life</label>
                    <textarea className={style.expandingTextarea} name="developmentalOutcomes" defaultValue={offpringData.developmentalOutcomes} onMouseEnter={_textareaAutosize} onKeyDown={_textareaAutosize} onChange={_handleDevelopmentalOutcomesChange}></textarea>
                </>
                : <>
                    <br />
                    <br />
                    <i>You will be able to enter followup information for this offspring once the pregnancy completes or is terminated. Please refer to the pregnancy data entry screen.</i>
                </>}
            <br />
            <br />
            <button onClick={_handleSubmit} onSubmit={_handleSubmit} type="submit">Save</button>
        </div>
    </>;
};

export { OffspringData };
