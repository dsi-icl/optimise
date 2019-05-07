import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../icon';
import { edssAlgorithmFromProps } from '../EDSScalculator/calculator';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';
import style from './patientProfile.module.css';

/*
Timeline:
Currently it takes the latest date and the earliest date in all the visits, tests, meds, and events in the patient profile,
and defined the css grid column number as the difference in days between the two. And then for each medical elements it calculates
from its date which css grid area it belongs to, by calculating the ratio and then rounding off.
*/
@connect(state => ({
    data: state.patientProfile.data,
    visitFields: state.availableFields.visitFields
}))
export class TimelineBox extends Component {   //unfinsihed
    render() {
        const allVisitDates = this.props.data.visits.filter(el => el.type === 1).map(el => el.visitDate);
        const allTestDates = this.props.data.tests.map(el => el.actualOccurredDate || el.expectedOccurDate);
        const allTreatmentDates = this.props.data.treatments.map(el => el.startDate);
        const allCEDates = [];
        this.props.data.clinicalEvents.forEach((el) => {
            allCEDates.push(el.dateStartDate);
            if (el.endDate) {
                allCEDates.push(el.endDate);
            }
        });
        const allDates = [...allVisitDates, ...allTestDates, ...allTreatmentDates, ...allCEDates].map(el => parseInt(el));
        allDates.sort((a, b) => a - b);
        let maxDatePoint = allDates[allDates.length - 1] - allDates[0];

        const TimelineDynamicStyle = {
            gridTemplateColumns: `18% 2% ${'0.8%'.repeat(100)}`,
            gridTemplateRows: '1em 0.5em 1em 0.5em 1em 0.5em 1em 0.5em 1em 0.5em 1.5em'

        };

        const mappingDateFunction = date => {
            if (date.length < 1)
                return null;
            if (date.length === 1)
                date[1] = date[0];
            let middle = date[0] + (date[date.length - 1] - date[0]) / 2;
            return (
                <>
                    <td style={{ textAlign: 'left' }}>{moment(date[0], 'x').format('MMM YYYY')}</td>
                    <td style={{ textAlign: 'center' }}>{moment(middle, 'x').format('MMM YYYY')}</td>
                    <td style={{ textAlign: 'right' }}>{moment(date[date.length - 1], 'x').format('MMM YYYY')}</td>
                </>
            );
        };


        const mappingVisitFunction = visit => {

            // const EDSSFieldID = this.props.visitFields.filter(field => field.idname === 'edss:expanded disability status scale - estimated total')[0].id;
            // const EDSSRecord = visit.data.filter(record => record.field === EDSSFieldID);

            const allSymptoms = visit.data.map(symptom => symptom.field);
            const relevantEDSSFields = this.props.visitFields.filter(field => allSymptoms.includes(field.id) && /^edss:(.*)/.test(field.idname));
            const computedEDSS = edssAlgorithmFromProps(relevantEDSSFields, visit.data);

            let edssPoints = null;

            if (computedEDSS && typeof computedEDSS === 'number' && !isNaN(computedEDSS))
                edssPoints = computedEDSS;
            else {
                let edssTotalId = this.props.visitFields.filter(el => el.idname === 'edss:expanded disability status scale - estimated total');
                if (edssTotalId.length > 0) {
                    edssTotalId = edssTotalId[0].id;
                    visit.data.filter(el => el.field === edssTotalId).forEach(e => {
                        edssPoints = e.value;
                    });
                }
            }

            const startDate = parseInt(visit.visitDate, 10);
            let start = Math.floor((startDate - allDates[0]) * 100 / maxDatePoint);
            let end = start + 1;
            end = end > 100 ? 100 : end;
            start = start >= end ? end - 1 : start;
            return (
                <Fragment key={`${visit.id}`}>
                    <a style={{ gridColumn: `${start + 3}/${end + 3}`, gridRow: '3' }} title={new Date(startDate).toDateString()} href={`#visit-${visit.id}`}>
                        <div className={style.timelineVisit}>-</div>
                    </a>
                    <a style={{ gridColumn: `${start + 3}/${end + 3}`, gridRow: '9' }} title={new Date(startDate).toDateString()} href={`#visit-${visit.id}`} className={style.miniTimelineEDSS}>
                        {edssPoints ? edssPoints : ''}
                        {/* {EDSSRecord && EDSSRecord.length ? EDSSRecord[0].value : ''} */}
                    </a>
                </Fragment>
            );
        };

        const mappingTestFunction = test => {

            const startDate = parseInt(test.actualOccurredDate || test.expectedOccurDate, 10);
            let start = Math.floor((startDate - allDates[0]) * 100 / maxDatePoint);
            let end = start + 1;
            end = end > 100 ? 100 : end;
            start = start >= end ? end - 1 : start;
            return (
                <a style={{ gridColumn: `${start + 3}/${end + 3}`, gridRow: '5' }} title={new Date(startDate).toDateString()} key={`${test.id}`} href={`#test-${test.id}`}>
                    <div className={style.timelineTest}>-</div>
                </a>
            );
        };

        const mappingMedFunction = med => {

            const startDate = parseInt(med.startDate, 10);
            const endDate = parseInt(med.terminatedDate || moment().valueOf(), 10);
            let start = Math.floor((startDate - allDates[0]) * 100 / maxDatePoint);
            let end = Math.ceil((endDate - allDates[0]) * 100 / maxDatePoint);
            end = end > 100 ? 100 : end;
            start = start >= end ? end - 1 : start;
            return (
                <a style={{ gridColumn: `${start + 3}/${end + 3}`, gridRow: '1' }} title={new Date(startDate).toDateString()} key={`${med.id}`} href={`#treatment-${med.id}`}>
                    <div className={style.timelineMed}>-</div>
                </a>
            );
        };

        const mappingCEFunction = CE => {

            const startDate = parseInt(CE.dateStartDate, 10);
            const endDate = parseInt(CE.endDate || moment().valueOf(), 10);
            let start = Math.floor((startDate - allDates[0]) * 100 / maxDatePoint);
            let end = Math.ceil((endDate - allDates[0]) * 100 / maxDatePoint);
            end = end > 100 ? 100 : end;
            start = start >= end ? end - 1 : start;
            return (
                <a style={{ gridColumn: `${start + 3}/${end + 3}`, gridRow: '7' }} title={new Date(startDate).toDateString()} key={`${CE.id}`} href={`#clinicalEvent-${CE.id}`}>
                    <div className={CE.type === 4 ? style.timelineCEBlack : style.timelineCE}>-</div>
                </a>
            );
        };

        return (
            <PatientProfileSectionScaffold sectionName='Timeline' actions={(
                <Link to={`/patientProfile/${this.props.data.patientId}/timeline`} title='Expand Timeline'>
                    <span className={style.expandTimeline}><Icon symbol='expand' /></span>
                </Link>
            )}>
                <div className={style.timelineBox} style={TimelineDynamicStyle}>
                    <div style={{ gridColumn: '1/2', gridRow: '1', overflow: 'hidden' }}>
                        Treatments
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '3', overflow: 'hidden' }}>
                        Visits
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '5', overflow: 'hidden' }}>
                        Tests
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '7', overflow: 'hidden' }}>
                        Events
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '9', overflow: 'hidden' }}>
                        EDSS
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '11', overflow: 'hidden' }}>

                    </div>
                    {this.props.data.treatments.map(mappingMedFunction)}
                    {this.props.data.visits.filter(el => el.type === 1).map(mappingVisitFunction)}
                    {this.props.data.tests.map(mappingTestFunction)}
                    {this.props.data.clinicalEvents.map(mappingCEFunction)}
                    <table style={{
                        gridColumn: '3/103',
                        gridRow: '11'
                    }} className={style.miniTimelineDateLine}>
                        <tbody>
                            <tr>
                                {mappingDateFunction(allDates)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </PatientProfileSectionScaffold>
        );
    }
}
