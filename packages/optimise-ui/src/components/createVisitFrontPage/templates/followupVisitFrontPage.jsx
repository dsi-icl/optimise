import React, { Component } from 'react';
import { VSFrontPageWrapper } from '../componentWrappers/vs/vsWrapper';
import { ComorbidityWrapper } from '../componentWrappers/comorbidity/comorbidityWrapper';
import { EDSSWrapper } from '../componentWrappers/edss/edssWrapper';
import { CommunicationWrapper } from '../componentWrappers/communication/communicationWrapper';
import { TreatmentWrapper } from '../componentWrappers/treatment/treatmentWrapper';
import { RelapseWrapper } from '../componentWrappers/ce/relapseWrapper';
import { TestWrapper } from '../componentWrappers/tests/labWrapper';
import { MRIWrapper } from '../componentWrappers/tests/mriWrapper';
import { OtherSAEWrapper } from '../componentWrappers/ce/otherSAEWrapper';
import { VisitFrontPageTemplate } from './template';
import { VisitFrontPageIntroduction } from '../componentWrappers/introductoryPage/introductoryPage';
import { ConcomitantMedWrapper } from '../componentWrappers/concomitantMed/concomitantMed';

export class FollowupVisitFrontPage extends Component {
    render() {
        const { match, location } = this.props;
        const pageNumberToElementMap = {
            0: <VisitFrontPageIntroduction match={match} location={location}/>,
            1: <VSFrontPageWrapper match={match} location={location} category={'vitals'} />,
            2: <ComorbidityWrapper yesOrNoQuestion={<p>Is there any <b>newly diagnosed</b> ICD11-identified comorbidity since last visit?</p>}/>,
            3: <EDSSWrapper yesOrNoQuestion={<p>Was an EDSS measurement performed at this visit?</p>}/>,
            4: <ConcomitantMedWrapper yesOrNoQuestion={
                <>
                    <p>Has the patient started any <b>new</b> non-disease-modifying medication and/or supplements, or had <b>any change</b> (including termination) thereof since last visit?</p>
                    <br/>
                    <p>If yes, please do the following:</p>
                    <p>1. Record any new medications or supplements for this visit; and</p>
                    <p>2. Edit and add end date to any previous medications that has been terminated.</p>
                </>}/>,
            5: <TreatmentWrapper
                yesOrNoQuestion={
                    <>
                        <p>Is there any <b>new disease-modifying treatments (DMT)</b>, <b>DMT switch</b>, or <b>new immunosuppressive medication</b> since last visit.</p>
                        <br/>
                        <p>To record a DMT switch, <b>edit the previous treatment providing an 'end date', and then record a new treatment</b>.</p>
                    </>
                }/>,
            6: <RelapseWrapper yesOrNoQuestion={<p>Is there any <b>MS relapse</b> since last visit?</p>}/>,
            7: <OtherSAEWrapper yesOrNoQuestion={<p>Is there any <b>serious adverse event</b>, <b>malignancy</b>, or <b>opportunistic infection</b> since last visit?</p> }/>,
            8: <TestWrapper yesOrNoQuestion={<p>Are there any lab results for <b>Anti-JCV antibody status</b>, <b>total white cell and lymphocyte count</b>, or <b>liver function</b> since last visit?</p>}/>,
            9: <MRIWrapper yesOrNoQuestion={<p>Are there any <b>brain MRI</b> results since last visit?</p>}/>,
            10: <CommunicationWrapper/>
        };

        const pageToTitleMap = {
            0: 'Introduction',
            1: 'Vital signs',
            2: 'Comorbidities',
            3: 'EDSS',
            4: 'Concomitant medications',
            5: 'Disease modifying treatments',
            6: 'Relapses',
            7: 'SAE\'s and infections',
            8: 'Lab tests',
            9: 'MRI',
            10: 'Communication and notes',
        };

        return (
            <VisitFrontPageTemplate
                match={match}
                location={location}
                isBaselineVisit={false}
                pageNumberToElementMap={pageNumberToElementMap}
                pageToTitleMap={pageToTitleMap}
            />
        );
    }
}