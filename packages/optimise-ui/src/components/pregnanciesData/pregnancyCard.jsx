import { useMemo } from 'react';
import style from './pregnancyPage.module.css';
import store from '../../redux/store';
import moment from 'moment';
import ordinal from 'ordinal';
import history from '../../redux/history';

export const PregnancyCard = ({ pregnancy }) => {
    const { availableFields, patientProfile: { currentPatient, data: { pregnancy: allPregnancies, pregnancyEntries } } } = useMemo(() => store.getState(), []);
    const pregnancyEntryFieldsMap = useMemo(() => (availableFields.pregnancyEntryFields_Hash ?? [])?.[0], [availableFields.pregnancyEntryFields]);
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

    const dataFieldsMap = {};
    relevantEntries.reverse().forEach((entry) => {
        entry.data?.forEach((data) => {
            dataFieldsMap[data.field] = data;
        });
    });
    const dataFields = Object.values(dataFieldsMap).map((data) => {
        const field = pregnancyEntryFieldsMap[data.field];
        return {
            type: field.type,
            definition: field.definition,
            value: data.value
        };
    }).filter(data => data.value !== null && data.value.trim() !== '');

    return (
        <div key={pregnancy.id} className={style.level}>
            <div className={style.levelHeader}>
                {ordinal(pregnancy.orderPosition + 1)}
                {' '}
                pregnancy
            </div>
            <div className={style.levelBody} style={{ padding: '1rem' }}>
                From
                {' '}
                {ordinal(pregnancyOrderPosition + 1)}
                {' '}
                pregnancy.
                <br />
                {pregnancyOutcome
                    ? (
                        <div>
                            <i>
                                {pregnancyOutcome.value}
                                {' '}
                                on the
                                {' '}
                                {moment(new Date(parseInt(pregnancy.outcomeDate, 10))).toLocaleString()}
                            </i>
                        </div>
                    )
                    : (
                        <div>
                            {mounthCountdown}
                            {' '}
                            month
                            {mounthCountdown > 1 ? 's' : ''}
                            {' '}
                            to expected term.
                        </div>
                    )}
                <table>
                    <tbody>
                        <tr>
                            <td>Pregnancy start date</td>
                            <td>{new Date(parseFloat(pregnancy.startDate)).toDateString()}</td>
                        </tr>
                        {pregnancy.outcomeDate !== null
                            ? (
                                <tr>
                                    <td>Pregnancy end date</td>
                                    <td>{new Date(parseFloat(pregnancy.outcomeDate)).toDateString()}</td>
                                </tr>
                            )
                            : null}
                        {dataFields.map((data, i) => (
                            <tr key={i}>
                                <td>{data.definition}</td>
                                <td>{data.type === 6 ? new Date(data.value).toDateString() : data.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    type="button"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => {
                        history.push(`/patientProfile/${currentPatient}/data/visit/${lastEntry.recordedDuringVisit}/pregnancy?fromPregnancy#epe_v${lastEntry.recordedDuringVisit}`);
                        document.getElementById(`epe_v${lastEntry.recordedDuringVisit}`).scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    }}
                >
                    {pregnancy.outcome === null ? 'Edit last entry' : 'Edit outcome entry'}
                </button>
                <br />
                <button type="button" style={{ marginTop: '0.5rem' }} onClick={() => history.push(`/patientProfile/${currentPatient}/pregnancy/${pregnancy.id}/offsprings?fromPregnancy`)}>Go to offsprings data</button>
            </div>
        </div>
    );
};
