import React, { useMemo } from 'react';
import capitalize from 'capitalize';
import style from './offspringPage.module.css';
import store from '../../redux/store';
import moment from 'moment';
import ordinal from 'ordinal';

export const OffspringCard = ({ offspring }) => {

    const { data, pregnancy } = offspring;
    const { availableFields, patientProfile: { data: { pregnancy: allPregnancies } } } = useMemo(() => store.getState(), []);
    const pregnancyOutcomeTypes = useMemo(() => availableFields.pregnancyOutcomes ?? [], [availableFields.pregnancyOutcomes]);
    const pregnancyOutcome = pregnancyOutcomeTypes.find(po => po.id === pregnancy.outcome);
    const plannedEndDate = moment(new Date(parseInt(pregnancy.startDate, 10))).add(9, 'months');
    const mounthCountdown = moment.duration(plannedEndDate.diff(moment.now())).asMonths().toFixed(0);
    const offspringValues = Object.entries(data);
    const pregnancyOrderPosition = (allPregnancies ?? []).sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate)).findIndex(p => p.id === pregnancy.id) ?? -1;

    return <div key={offspring.id} className={style.level}>
        <div className={style.levelHeader}>Offspring ID{offspring.id}</div>
        <div className={style.levelBody} style={{ padding: '1rem' }}>
            From {ordinal(pregnancyOrderPosition + 1)} pregnancy.<br />
            {pregnancyOutcome
                ? <div>
                    <i>{pregnancyOutcome.value} on the {moment(new Date(parseInt(pregnancy.outcomeDate, 10))).toLocaleString()}</i>
                </div>
                : <div>
                    {mounthCountdown} month{mounthCountdown > 1 ? 's' : ''} to expected term.</div>
            }
            <table>
                <tbody>
                    {offspringValues.length
                        ? offspringValues.filter(([key]) => key !== 'id').map(([key, value]) => (
                            <tr key={key}>
                                <td>{capitalize(key)}</td>
                                <td>{value}</td>
                            </tr>))
                        : <tr>
                            <td colSpan="2"><i>No data</i></td>
                        </tr>}
                </tbody>
            </table>
            {pregnancyOutcome
                ? <button style={{ marginTop: '0.5rem' }}>Edit offspring data postpartum</button>
                : null//<button style={{ marginTop: '0.5rem' }}>Record death in-utero</button>
            }
        </div>
    </div>;
};