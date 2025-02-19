import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BackButton } from './utils';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
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

    useEffect(() => {
        try {
            if (fetching)
                return;
            if (offpringData === null && offspring?.data)
                setOffpringData(JSON.parse(offspring?.data));
        } catch (e) {
            // ignore
        }
    }, [fetching, offpringData, offspring]);

    const _handleNameChange = (event) => {
        offpringData.name = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleGenderChange = (event) => {
        offpringData.gender = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleWeigthChange = (event) => {
        offpringData.weight = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleAPGAR1Change = (event) => {
        offpringData.apgar1 = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleAPGAR5Change = (event) => {
        offpringData.apgar5 = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleCongenitalAffectMinorChange = (event) => {
        offpringData.congenitalAffectMinor = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleCongenitalAffectMajorChange = (event) => {
        offpringData.congenitalAffectMajor = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleFeedingModeChange = (event) => {
        offpringData.feedingMode = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleBreastFeedingChange = (event) => {
        offpringData.breastFeedingDuration = event.target.value;
        setOffpringData(offpringData);
    };

    const _handleHospitalAdmissionFirstYearChange = (event) => {
        offpringData.hospitalAdmissionFirstYear = event.target.value;
        setOffpringData(offpringData);
    };
    const _handleDevelopmentalOutcomesChange = (event) => {
        offpringData.developmentalOutcomes = event.target.value;
        setOffpringData(offpringData);
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
            <h2>EDIT OFFSPRING DATA ({offpringData.name ?? `ID${offspring.id}`})</h2>
            <BackButton to={`/patientProfile/${currentPatient}/offsprings`} />
        </div>
        <div className={scaffold_style.panel}>
            <label>Name</label>
            <input defaultValue={offpringData.name} onChange={_handleNameChange} />
            <br /><br />
            <label >Gender</label>
            <select defaultValue={offpringData.gender} onChange={_handleGenderChange}>
                <option value='unselected'></option>
                <option value='male'>Boy</option>
                <option value='female'>Girl</option>
            </select>
            {atDeliveryOutcome
                ? <>
                    <br /><br />
                    <label>Weight of infant at delivery</label>
                    <input defaultValue={offpringData.weight} onChange={_handleWeigthChange} />
                    <br /><br />
                    <label>APGAR score at 1 minute</label>
                    <input defaultValue={offpringData.apgar1} onChange={_handleAPGAR1Change} />
                    <br /><br />
                    <label>APGAR score at 5 minutes</label>
                    <input defaultValue={offpringData.apgar5} onChange={_handleAPGAR5Change} />
                    <br /><br />
                    <label>Presence of <u style={{ textDecoration: 'underline' }}>minor</u> congential malformations (EUROCAT)</label>
                    <input defaultValue={offpringData.congenitalAffectMinor} onChange={_handleCongenitalAffectMinorChange} />
                    <br /><br />
                    <label>Presence of <u style={{ textDecoration: 'underline' }}>major</u> congential malformations (EUROCAT)</label>
                    <input defaultValue={offpringData.congenitalAffectMajor} onChange={_handleCongenitalAffectMajorChange} />
                    <br /><br />
                    <label >Mode of infant feeding</label>
                    <select defaultValue={offpringData.feedingMode} onChange={_handleFeedingModeChange}>
                        <option value='unselected'></option>
                        <option value='breastfeeding'>Breastfeeding</option>
                        <option value='formula'>Formula</option>
                        <option value='mixed'>Mixed</option>
                    </select>
                    <br /><br />
                    <label>Duration of breastfeeding</label>
                    <input defaultValue={offpringData.breastFeedingDuration} onChange={_handleBreastFeedingChange} />
                    <br /><br />
                    <label>Admission of infant to hospital within the first year of life</label>
                    <input type='checkbox' checked={offpringData.hospitalAdmissionFirstYear} onChange={_handleHospitalAdmissionFirstYearChange} />
                    <br /><br />
                    <label>Developmental outcomes during the first 5 years of life</label>
                    <input defaultValue={offpringData.developmentalOutcomes} onChange={_handleDevelopmentalOutcomesChange} />
                </>
                : <>
                    <br />
                    <br />
                    <i>You will be able to enter followup information for this offspring once the pregnancy completes or is terminated. Please refer to the pregnancy data entry screen.</i>
                </>
            }
            <br />
            <br />
            <button onClick={_handleSubmit} onSubmit={_handleSubmit} type='submit'>Save</button>
        </div>
    </>;
};

export { OffspringData };