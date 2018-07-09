import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';
import cssTimeline from '../../../css/timelineelements.css';


/*
Timeline:
Currently it takes the latest date and the earliest date in all the visits, tests, meds, and events in the patient profile,
and defined the css grid column number as the difference in days between the two. And then for each medical elements it calculates
from its date which css grid area it belongs to, by calculating the ratio and then rounding off.
*/
@connect(state => ({ data: state.patientProfile.data }))
export class TimelineBox extends Component {   //unfinsihed
    render() {
        const allVisitDates = this.props.data.visits.map(el => el.visitDate);
        const allTestDates = this.props.data.tests.map(el => el.expectedOccurDate);
        const allDates = [...allVisitDates, ...allTestDates];
        allDates.sort();
        const daySpan = parseInt(((parseInt(allDates[allDates.length - 1], 10) - parseInt(allDates[0], 10)) / 86400000 ), 10);
        const numOfCols = `10% ${'1fr '.repeat(daySpan + 3)}`;
        const TimelineDynamicStyle = {
            gridTemplateColumns: numOfCols
        }
        const mappingVisitFunction = visit => {
            const date = visit.visitDate;
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${date}`} href={`#visit/${visit.visitId}`} style={{ gridColumn: `${ratio+3}/${ratio+4}`, gridRow: '1/2', textDecoration: 'none' }}>
                    <div style={{  borderRadius: '30%', backgroundColor: 'rgb(133, 150, 176)', color: 'rgb(133, 150, 176)' }}>
                        -
                    </div>
                </a>
            );
        };
        const mappingTestFunction = test => {
            const date = test.expectedOccurDate;
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${date}test`} href={`#test/${test.testId}`} style={{ gridColumn: `${ratio+3}/${ratio+4}`, gridRow: '3/4', textDecoration: 'none' }}>
                    <div style={{  borderRadius: '30%', backgroundColor: 'rgb(153, 202, 120)', color: 'rgb(153, 202, 120)' }}>
                        -
                    </div>
                </a>
            );
        };
        const mappingMedFunction = med => {
            const date = 1514764800000;    //change this later to real visit date
            const ratio = parseInt((date - allDates[0]) / 86400000, 10);
            const durationInDays = med.durationWeeks * 7; 
            console.log(`durationInDays = ${durationInDays} || ${ratio}`);
            return (
                <a title={new Date(parseInt(date, 10)).toDateString()} key={`${date}med`} href="#trialanchor" style={{ gridColumn: `${ratio+3}/${ratio+durationInDays+4}`, gridRow: '2/3', textDecoration: 'none' }}>
                    <div style={{  borderRadius: 10, backgroundColor: '#ffca1b', color: '#ffca1b' }}>
                        -
                    </div>
                </a>
            );
        };
        return (
            <PatientProfileSectionScaffold sectionName='Timeline'>
                <div className={cssTimeline.timelineBox} style={TimelineDynamicStyle}>
                    <div style={{ gridColumn: '1/2', gridRow: '1/2', overflow: 'hidden' }}>
                        Visits
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '2/3', overflow: 'hidden' }}>
                        Meds
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '3/4', overflow: 'hidden' }}>
                        Tests
                    </div>
                    <div style={{ gridColumn: '1/2', gridRow: '4/5', overflow: 'hidden' }}>
                        Events
                    </div>
                    {this.props.data.visits.map(mappingVisitFunction)}
                    {this.props.data.tests.map(mappingTestFunction)}
                    {this.props.data.treatments.map(mappingMedFunction)}
                </div>
            </PatientProfileSectionScaffold>
        )
    }
}
