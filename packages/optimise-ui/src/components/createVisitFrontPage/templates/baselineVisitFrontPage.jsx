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
import { PregnancyWrapper } from '../componentWrappers/pregnancy/pregnancyWrapper';

export class BaselineVisitFrontPage extends Component {
    render() {
        const { match, location } = this.props;

        const pageNumberToElementMap = {
            0: <VisitFrontPageIntroduction match={match} location={location}/>,
            1: <VSFrontPageWrapper match={match} location={location} category={'vitals'} />,
            2: <ComorbidityWrapper yesOrNoQuestion={<p>Is there any current or previous ICD11-identified comorbidity?</p>}/>,
            3: <EDSSWrapper yesOrNoQuestion={<p>Was an EDSS measurement performed at this visit?</p>}/>,
            4: <ConcomitantMedWrapper yesOrNoQuestion={<p>Has the patient been on any non-disease modifying medication and/or supplements?</p>}/>,
            5: <TreatmentWrapper yesOrNoQuestion={<p>Has the patient been subject to any <b>current</b> or <b>previous</b> <b>disease-modifying treatments (DMT)</b>.</p>}/>,
            6: <RelapseWrapper yesOrNoQuestion={<p>Have there been any <b>MS relapses within the last 2 years</b>?</p>}/>,
            7: <OtherSAEWrapper yesOrNoQuestion={<p>Is there any <b>serious adverse event</b>, <b>malignancy</b>, or <b>opportunistic infection</b> prior?</p> }/>,
            8: <TestWrapper yesOrNoQuestion={<p>Is there any baseline lab result for <b>Anti-JCV antibody status</b>, <b>total white cell and lymphocyte count</b>, or <b>liver function</b> available?</p>}/>,
            9: <MRIWrapper yesOrNoQuestion={<p>Is there any baseline <b>brain MRI</b> result available?</p>}/>,
            10: <PregnancyWrapper yesOrNoQuestion={<p>Do you wish to record pregnancy data?</p>}/>,
            11: <CommunicationWrapper/>,
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
            10: 'Pregnancy',
            11: 'Communication and notes'
        };

        return (
            <VisitFrontPageTemplate
                match={match}
                location={location}
                isBaselineVisit={true}
                pageNumberToElementMap={pageNumberToElementMap}
                pageToTitleMap={pageToTitleMap}
            />
        );
    }
}
