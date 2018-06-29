import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold } from './sharedComponents.jsx';

@connect(state => ({ data: state.patientProfile.data }))
export class Timeline extends Component {   //unfinsihed
    render() {
        if (this.props.data.visits && this.props.data.tests) {
            const allVisitDates = this.props.data.visits.map(el => el.visitDate);
            const allTestDates = this.props.data.tests.map(el => el.expectedOccurDate);
            const allDates = [...allVisitDates, ...allTestDates];
            allDates.sort();
            const daySpan = parseInt(((parseInt(allDates[allDates.length - 1], 10) - parseInt(allDates[0], 10)) / 86400000 ), 10);
            console.log(daySpan);
            const numOfCols = `10% ${'1fr '.repeat(daySpan + 3)}`;
            const bigWrapper = {
                backgroundColor: 'rgb(210, 210, 210)',
                borderRadius: 10,
                width: '100%',
                height: 130,
                display: 'grid',
                padding: 7,
                gridTemplateColumns: numOfCols,
                gridTemplateRows: '1fr 1fr 1fr 1fr 1fr'
            }
            const mappingFunction = visit => {
                const date = visit.visitDate;
                const ratio = parseInt((date - allDates[0]) / 86400000, 10);
                console.log('ratio: ' + ratio);
                return (
                    <a title={new Date(parseInt(date, 10)).toDateString()} key={`${date}`} href="#trialanchor" style={{ gridColumn: `${ratio}/${ratio+1}`, gridRow: '1/2' }}>
                        <div style={{  borderRadius: '20%', backgroundColor: 'rgb(133, 150, 176)', color: 'rgb(133, 150, 176)' }}>
                            -
                        </div>
                    </a>
                );
            };
            return (
                <PatientProfileSectionScaffold sectionName='Timeline'>
                    <div style={bigWrapper}>
                        <div style={{  backgroundColor: 'green', gridColumn: '1/2', gridRow: '1/2', overflow: 'hidden' }}>
                        Visits
                        </div>
                        <div style={{  backgroundColor: 'green', gridColumn: '1/2', gridRow: '2/3', overflow: 'hidden' }}>
                        Meds
                        </div>
                        <div style={{  backgroundColor: 'green', gridColumn: '1/2', gridRow: '3/4', overflow: 'hidden' }}>
                        Tests
                        </div>
                        <div style={{  backgroundColor: 'green', gridColumn: '1/2', gridRow: '4/5', overflow: 'hidden' }}>
                        Events
                        </div>
                        {this.props.data.visits.map(mappingFunction)}
                        <a href="#trialanchor" style={{ gridColumn: '55/56', gridRow: '3/4' }}><div style={{  borderRadius: '20%', backgroundColor: 'yellow', color: 'yellow' }}>
                            -
                        </div></a>
                    </div>
                </PatientProfileSectionScaffold>
            )
        } else {
            return null;
        }
    }
}
