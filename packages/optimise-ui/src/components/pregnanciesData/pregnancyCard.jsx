import React, { useMemo } from 'react';
import capitalize from 'capitalize';
import style from './pregnancyPage.module.css';
import store from '../../redux/store';
import moment from 'moment';
import ordinal from 'ordinal';
import history from '../../redux/history';

export const PregnancyCard = ({ pregnancy }) => {

    const { availableFields, patientProfile: { currentPatient, data: { pregnancy: allPregnancies, pregnancyEntries, offsprings } } } = useMemo(() => store.getState(), []);
    const pregnancyOutcomeTypes = useMemo(() => availableFields.pregnancyOutcomes ?? [], [availableFields.pregnancyOutcomes]);
    const pregnancyOutcome = pregnancyOutcomeTypes.find(po => po.id === pregnancy.outcome);
    const plannedEndDate = moment(new Date(parseInt(pregnancy.startDate, 10))).add(9, 'months');
    const mounthCountdown = moment.duration(plannedEndDate.diff(moment.now())).asMonths().toFixed(0);
    const pregnancyOrderPosition = (allPregnancies ?? []).sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate)).findIndex(p => p.id === pregnancy.id) ?? -1;

    const pregnancyData = { ...pregnancy };
    delete pregnancyData.id;
    delete pregnancyData.deleted;
    delete pregnancyData.startDate;
    delete pregnancyData.orderPosition;

    const relevantEntries = pregnancyEntries.filter(entry => entry.pregnancyId === pregnancy.id).sort((a, b) => parseInt(b.id) - parseInt(a.id));
    const lastEntry = relevantEntries[0];

    return <div key={pregnancy.id} className={style.level}>
        <div className={style.levelHeader}>{ordinal(pregnancy.orderPosition + 1)} pregnancy</div>
        <div className={style.levelBody} style={{ padding: '1rem' }}>
            From {ordinal(pregnancyOrderPosition + 1)} pregnancy.<br />
            {pregnancyOutcome
                ? <div>
                    <i>{pregnancyOutcome.value} on the {moment(new Date(parseInt(pregnancy.outcomeDate, 10))).toLocaleString()}</i>
                </div>
                : <div>
                    {mounthCountdown} month{mounthCountdown > 1 ? 's' : ''} to expected term.
                </div>
            }
            <table>
                <tbody>
                    <tr>
                        <td>Pregnancy start date</td>
                        <td>{new Date(parseFloat(pregnancy.startDate)).toDateString()}</td>
                    </tr>
                    {pregnancy.outcomeDate !== null
                        ? <tr>
                            <td>Pregnancy end date</td>
                            <td>{new Date(parseFloat(pregnancy.outcomeDate)).toDateString()}</td>
                        </tr>
                        : null
                    }
                </tbody>
            </table>
            {pregnancy.outcome === null
                ? <>
                    <button type='button' style={{ marginTop: '0.5rem' }} onClick={() => {
                        history.push(`/patientProfile/${currentPatient}/data/visit/${lastEntry.recordedDuringVisit}/pregnancy?fromPregnancy#epe_v${lastEntry.recordedDuringVisit}`);
                        document.getElementById(`epe_v${lastEntry.recordedDuringVisit}`).scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    }}>Edit last entry</button>
                    <br />
                </>
                : null}
            <button type='button' style={{ marginTop: '0.5rem' }} onClick={() => history.push(`/patientProfile/${currentPatient}/pregnancy/${pregnancy.id}/offsprings?fromPregnancy`)}>Go to offsprings data</button>
        </div>
    </div>;
};