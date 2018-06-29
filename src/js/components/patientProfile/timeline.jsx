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
            const numOfCols = '10% ' + '1fr '.repeat(1000 + 1);
            const bigWrapper = {
                backgroundColor: 'darkgrey',
                borderRadius: 10,
                width: '100%',
                height: 200,
                display: 'grid',
                padding: 7,
                gridTemplateColumns: numOfCols,
                gridTemplateRows: '1fr 1fr 1fr 1fr 1fr'
            }
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
                        <div style={{  backgroundColor: 'yellow', color: 'yellow', gridColumn: '55/56', gridRow: '3/4' }}>
                            <a href="#trialanchor">-</a>
                        </div>
                    </div>
                </PatientProfileSectionScaffold>
            )
        } else {
            return null;
        }
    }
}
