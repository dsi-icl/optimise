import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import style from '../frontpage.module.css';

@connect(state => ({
    patientProfile: state.patientProfile.data
    }))
class VisitFrontPageTemplate extends Component {
    render() {
        const { match: { params }, patientProfile: { visits }, isBaselineVisit, pageNumberToElementMap, pageToTitleMap } = this.props;

        if (visits === undefined)
            return null;

        const visitFiltered = visits.filter(el => parseInt(params.visitId) === el.id);
        const currentPageNumber = parseInt(params.currentPage) + 1;

        return (
            <>
                <div className={style.ariane}>
                    <h2>{isBaselineVisit ? 'Baseline' : 'Follow-up'} Visit Initial Data Entry ({this.props.match.params.patientId}) - Page {currentPageNumber}/12: {pageToTitleMap[params.currentPage]} </h2>
                </div>
                <div className={style.panel}>
                    {visitFiltered.length === 1 ?
                        <RenderCurrentPage
                            match={this.props.match}
                            location={this.props.location}
                            pageNumberToElementMap={pageNumberToElementMap}
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

export {VisitFrontPageTemplate};

class RenderCurrentPage extends PureComponent {
    constructor() {
        super();
        this.returnCurrentElement = this.returnCurrentElement.bind(this);
    }

    returnCurrentElement() {
        const { match: { params }, pageNumberToElementMap } = this.props;
        return pageNumberToElementMap[params.currentPage];
    }

    render() {
        const { params: { currentPage } } = this.props.match;
        const _currentPage = parseInt(currentPage, 10);
        if (_currentPage === undefined || _currentPage < 0 || _currentPage > 11) {
            return <p>Something went wrong. Please go back.</p>;
        }

        return this.returnCurrentElement();
    }
}
