import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../icon';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';
import style from './patientProfile.module.css';
import { Set } from '../../../../node_modules/immutable';

/*
Timeline:
Currently it takes the latest date and the earliest date in all the visits, tests, meds, and events in the patient profile,
and defined the css grid column number as the difference in days between the two. And then for each medical elements it calculates
from its date which css grid area it belongs to, by calculating the ratio and then rounding off.
*/
@connect(state => ({ data: state.patientProfile.data }))
export class TimelineBox extends Component {   //unfinsihed
    render() {
        const allVisitDates = this.props.data.visits.filter(el => el.type === 1).map(el => el.visitDate);
        const allTestDates = this.props.data.tests.map(el => el.expectedOccurDate);
        const allTreatmentDates = this.props.data.treatments.map(el => el.startDate);
        const allCEDates = [];
        this.props.data.clinicalEvents.forEach(function (el) {
            allCEDates.push(el.dateStartDate);
            if (el.endDate) {
                allCEDates.push(el.endDate);
            }
        });
        const allDates = [...allVisitDates, ...allTestDates, ...allTreatmentDates, ...allCEDates].map(el => parseInt(el));
        allDates.sort();
        console.log('ALL DATES', allDates);
        const daySpan = parseInt(((allDates[allDates.length - 1] - allDates[0]) / 86400000), 10);
        const numOfCols = `10% ${'1fr '.repeat(daySpan + 3)}`;
        const TimelineDynamicStyle = {
            gridTemplateColumns: numOfCols,
            gridTemplateRows: '1em 0.5em 1em 0.5em 1em 0.5em 1em 0.5em 1em'

        };
        const months = {
            0: 'jan',
            1: 'feb',
            2: 'mar',
            3: 'apr',
            4: 'may',
            5: 'jun',
            6: 'jul',
            7: 'aug',
            8: 'sep',
            9: 'oct',
            10: 'nov',
            11: 'dec'
        };


        const mappingDateFunction = date => {
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            return (
                <div key={date} style={{ fontSize: 8, gridColumn: `${ratio + 3}/${ratio + 4}`, gridRow: '9', overflow: 'visible' }}>{`${months[new Date(parseInt(date)).getMonth()]} ${new Date(parseInt(date)).getFullYear()}`}</div>
            );
        };


        const mappingVisitFunction = visit => {
            const date = visit.visitDate;
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${visit.id}`} href={`#visit/${visit.id}`} style={{ gridColumn: `${ratio + 3}/${ratio + 4}`, gridRow: '3', textDecoration: 'none' }}>
                    <div className={style.timelineVisit}>-</div>
                </a>
            );
        };

        const mappingTestFunction = test => {
            const date = test.expectedOccurDate;
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${test.id}test`} href={`#test/${test.id}`} style={{ gridColumn: `${ratio + 3}/${ratio + 4}`, gridRow: '5', textDecoration: 'none' }}>
                    <div className={style.timelineTest}>-</div>
                </a>
            );
        };

        const mappingMedFunction = med => {
            const date = med.startDate;
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            let endDate = med.terminatedDate && !isNaN(parseInt(med.terminatedDate)) ? parseInt(med.terminatedDate) : moment().valueOf();
            const durationInDays = Math.floor((endDate - parseInt(med.startDate)) / 1000 / 60 / 60 / 24);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${med.id}med`} href={`#treatment/${med.id}`} style={{ gridColumn: `${ratio + 3}/${ratio + durationInDays + 4}`, gridRow: '1', textDecoration: 'none' }}>
                    <div className={style.timelineMed}>-</div>
                </a>
            );
        };

        const mappingCEFunction = CE => {
            const date = parseInt(CE.dateStartDate);
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            const durationInDays = CE.endDate ? parseInt((parseInt(CE.endDate) - date) / 86400000, 10) : 1;
            return (
                <a title={new Date(date).toDateString()} key={`${CE.id}ce`} href={`#clinicalEvent/${CE.id}`} style={{ gridColumn: `${ratio + 3}/${ratio + durationInDays + 4}`, gridRow: '7', textDecoration: 'none' }}>
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
                        Meds
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
                        
                    </div>
                    {this.props.data.visits.filter(el => el.type === 1).map(mappingVisitFunction)}
                    {this.props.data.tests.map(mappingTestFunction)}
                    {this.props.data.treatments.map(mappingMedFunction)}
                    {this.props.data.clinicalEvents.map(mappingCEFunction)}
                    {formatDate(allDates).map(mappingDateFunction)}
                </div>
            </PatientProfileSectionScaffold>
        );
    }
}


function formatDate(allDates) {
    const oneday = 86400000;
    const ds = new Set(allDates);
    const d = Array.from(ds.values());
    if (d.length < 4) {
        return d;
    }
    const allYears = d.map(el => new Date(el).getFullYear());
    const ys = new Set(allYears);
    const y = Array.from(ys.values());
    const firstInstances = Array(d.length).fill(false);
    for (let i = 0; i < y.length; i++) {
        firstInstances[allYears.indexOf(y[i])] = true;
    }
    return d.filter((el, ind) => firstInstances[ind]);
}