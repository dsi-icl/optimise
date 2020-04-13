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
                    <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
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
        this.calcNextPage = this.calcNextPage.bind(this);
        this.calcLastPage = this.calcLastPage.bind(this);
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
            2: <ComorbidityWrapper match={this.props.match} location={this.props.location}/>,
            3: <EDSSWrapper match={this.props.match} location={this.props.location}/>,
            4: <h3>Concomitant medications</h3>,
            5: <TreatmentWrapper match={this.props.match}/>,
            6: <CeWrapper match={this.props.match}/>,
            7: <TestWrapper match={this.props.match} location={this.props.location}/>, //  lab test
            8: <MRIWrapper match={this.props.match} location={this.props.location}/>, //  lab test
            9: <CommunicationWrapper match={this.props.match} location={this.props.location}/>
        };
        return elements[params.currentPage];
    }

    calcNextPage() {
        const currentPage = parseInt(this.props.match.params.currentPage, 10);
        return currentPage + 1;
    }

    calcLastPage() {
        const currentPage = parseInt(this.props.match.params.currentPage, 10);
        return currentPage - 1;
    }

    render() {
        const { params: { currentPage, patientId, visitId } } = this.props.match;
        const _currentPage = parseInt(currentPage, 10);
        if (_currentPage === undefined || _currentPage < 0 || _currentPage > 9) {
            return <p>Something went wrong. Please go back.</p>;
        }

        const backbutton = <div><NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${this.calcLastPage()}`}><button>Last page</button></NavLink></div>;
        const nextbutton = <div><NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${this.calcNextPage()}`}><button>Next page (does not automatically save)</button></NavLink></div>;
        return <>
            <div className={style.page}>
                { this.returnCurrentElement() }
            </div>
            <div className={style.page_navigation_buttons}>
                { currentPage === '0' ? <div><NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${this.calcNextPage()}`}><button>Start</button></NavLink></div> : null }
                { currentPage === '9' ? <>{backbutton}<div><NavLink to={`/patientProfile/${patientId}`}><button className={style.finish_button}>Finish</button></NavLink></div></> : null }
                { (currentPage !== '9' && currentPage !== '0')
                    ?
                    <>
                        {backbutton}
                        {nextbutton}
                    </>
                    :
                    null
                }
            </div>
        </>;
    }
}