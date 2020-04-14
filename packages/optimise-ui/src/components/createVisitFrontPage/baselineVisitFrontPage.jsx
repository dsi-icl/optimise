import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import style from './frontpage.module.css';
import { NavLink } from 'react-router-dom';
import { VSFrontPageWrapper } from './componentWrappers/vs/vsWrapper';
import { ComorbidityWrapper } from './componentWrappers/comorbidity/comorbidityWrapper';
import { EDSSWrapper } from './componentWrappers/edss/edssWrapper';
import { CommunicationWrapper } from './componentWrappers/communication/communicationWrapper';
import { TreatmentWrapper } from './componentWrappers/treatment/treatmentWrapper';
import { CeWrapper } from './componentWrappers/ce/ceWrapper';
import { TestWrapper } from './componentWrappers/tests/labWrapper';
import { MRIWrapper } from './componentWrappers/tests/mriWrapper';
import { FrontPageNavigationButton } from './componentWrappers/navigationButtons/navigationButtons';

@connect(state => ({
    visitFields: state.availableFields.visitFields,
    patientProfile: state.patientProfile.data,
    sections: state.availableFields.visitSections
}))
export class BaselineVisitFrontPage extends Component {
    // this.props.match has params: patientId and visitId and currentPage
    render() {
        const { match: { params }, patientProfile: { visits } } = this.props;

        if (visits === undefined)
            return null;

        const visitFiltered = visits.filter(el => parseInt(params.visitId) === el.id);
        const currentPageNumber = parseInt(params.currentPage) + 1;

        const pageToTitles = {
            0: 'Introduction',
            1: 'Vital signs',
            2: 'Comorbidities',
            3: 'EDSS',
            4: 'Concomitant medications',
            5: 'Disease modifying treatments',
            6: 'SAE\'s and infections',
            7: 'Lab tests',
            8: 'MRI',
            9: 'Communication and notes',
        };

        return (
            <>
                <div className={style.ariane}>
                    <h2>Baseline Visit Initial Data Entry ({this.props.match.params.patientId}) - Page {currentPageNumber}/10: {pageToTitles[params.currentPage]} </h2>
                </div>
                <div className={style.panel}>
                    {visitFiltered.length === 1 ?
                        <RenderCurrentPage
                            match={this.props.match}
                            location={this.props.location}
                        />
                        :
                        <div>
                            <i>We could not find the visit you are looking for.</i>
                        </div>
                    }
                </div>
            </>
        );
    }
}

class RenderCurrentPage extends PureComponent {
    // this.props.{currentPage, match, location, _nextPage _lastPage}
    constructor() {
        super();
        this.returnCurrentElement = this.returnCurrentElement.bind(this);
    }

    returnCurrentElement() {
        const { params } = this.props.match;
        const elements = {
            0: <>
                <span>
                    You will be guided to enter the essential data for this visit in steps.
                    You will be able to edit these data afterwards in the patients homepage.</span><br /><br />
                <br /><br />
            </>,
            1: <VSFrontPageWrapper match={this.props.match} category={'vitals'} />,
            2: <ComorbidityWrapper/>,
            3: <EDSSWrapper/>,
            4: <h3>Concomitant medications</h3>,
            5: <TreatmentWrapper/>,
            6: <CeWrapper/>,
            7: <TestWrapper/>,
            8: <MRIWrapper/>,
            9: <CommunicationWrapper/>
        };
        return elements[params.currentPage];
    }

    render() {
        const { params: { currentPage, patientId, visitId } } = this.props.match;
        const _currentPage = parseInt(currentPage, 10);
        if (_currentPage === undefined || _currentPage < 0 || _currentPage > 9) {
            return <p>Something went wrong. Please go back.</p>;
        }

        return <>
            <div className={style.page}>
                { this.returnCurrentElement() }
            </div>
            <FrontPageNavigationButton match={this.props.match} location={this.props.location}/>
        </>;
    }
}