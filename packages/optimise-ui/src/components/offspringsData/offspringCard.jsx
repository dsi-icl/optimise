import React, { useMemo } from 'react';
import style from './offspringPage.module.css';
import store from '../../redux/store';
import moment from 'moment';

export const OffspringCard = ({ offspring }) => {

    const { data, pregnancy } = offspring;
    const pregnancyOutcomes = useMemo(() => store.getState()?.availableFields?.pregnancyOutcomes ?? [], []);
    const pregnancyOutcome = pregnancyOutcomes.find(po => po.id === pregnancy.outcome);
    const plannedEndDate = moment(new Date(parseInt(pregnancy.startDate, 10))).add(9, 'months');
    const mounthCountdown = moment.duration(plannedEndDate.diff(moment.now())).asMonths().toFixed(0);

    const offspringValues = Object.entries(data);

    return <div key={offspring.id} className={style.level}>
        <div className={style.levelHeader}>Offspring ID{offspring.id}</div>
        <div className={style.levelBody} style={{ padding: '1rem' }}>
            {pregnancyOutcome
                ? <div>
                    <i>{pregnancyOutcome.value} on the {pregnancy.outcomeDate}</i>
                    <div>Birth date: {data.birthDate}</div>
                    <div>Birth weight: {data.birthWeight}</div>
                </div>
                : <div>
                    Not born yet.<br />
                    {mounthCountdown} month{mounthCountdown > 1 ? 's' : ''} to expected term.</div>
            }
            <table>
                <tbody>
                    {offspringValues.length
                        ? offspringValues.filter(([key]) => key !== 'id').map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>))
                        : <tr>
                            <td colSpan="2"><i>No data</i></td>
                        </tr>}
                </tbody>
            </table>
            <button style={{ marginTop: '0.5rem' }}>Edit offspring data</button>
        </div>
    </div>;
};