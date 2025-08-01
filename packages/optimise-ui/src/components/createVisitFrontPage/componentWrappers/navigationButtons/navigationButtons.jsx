import { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import qs from 'query-string';
import style from '../../frontpage.module.css';

import { connect } from 'react-redux';

@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
class FrontPageNavigationButton extends Component {
    _lastPageAnsweredYes(currentPageInString) {
        const queryParsed = qs.parse(this.props.location.search, { arrayFormat: 'comma' });
        let query_yesPages = queryParsed.yesPages;
        if (!query_yesPages) return false;
        if (typeof query_yesPages === 'string') {
            query_yesPages = [query_yesPages];
        }
        return query_yesPages.includes(calcLastPage(currentPageInString).toString());
    }

    _nextPageAnsweredYes(currentPageInString) {
        const queryParsed = qs.parse(this.props.location.search, { arrayFormat: 'comma' });
        let query_yesPages = queryParsed.yesPages;
        if (!query_yesPages) return false;
        if (typeof query_yesPages === 'string') {
            query_yesPages = [query_yesPages];
        }
        return query_yesPages.includes(calcNextPage(currentPageInString).toString());
    }

    _isAYesOrNoPage() {
        const index = this.props.location.pathname.indexOf('yes_or_no');
        if (index === -1) {
            return false;
        }
        else {
            return true;
        }
    }

    _isCompulsoryPage(currentPageInString) {
        return ['1'].includes(currentPageInString);
    }

    render() {
        const { params: { currentPage, visitId, patientId } } = this.props.match;
        const { onClickNext, formSaved } = this.props;
        const { pregnancySubStudyConsent } = this.props.data;
        const searchString = this.props.location.search;

        if (formSaved && formSaved()) {
            return <Redirect to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`} />;
        }

        const backButtonWithoutDiv
            = (
                <NavLink
                    to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcLastPage(currentPage)}${this._lastPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}
                >
                    <button>
                        <b>&lt;&lt;</b>
                        Go back
                    </button>
                </NavLink>
            );

        const backButton = <div>{backButtonWithoutDiv}</div>;

        const nextButton = this._isAYesOrNoPage() && !this._isCompulsoryPage(currentPage)
            ? (
                <div>
                    <button disabled style={{ visibility: 'hidden' }}>
                        Continue
                        <b>&gt;&gt;</b>
                    </button>
                </div>
            )
            : (
                onClickNext
                    ? (
                        <div>
                            <button onClick={onClickNext}>
                                Save and continue
                                <b>&gt;&gt;</b>
                            </button>
                        </div>
                    )
                    : (
                        <div>
                            <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}>
                                <button onClick={onClickNext}>
                                    Continue
                                    <b>&gt;&gt;</b>
                                </button>
                            </NavLink>
                        </div>
                    )
            );

        const firstPageButton = (
            <div>
                <NavLink
                    to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}
                >
                    <button>Start</button>
                </NavLink>
            </div>
        );

        const finishButton = (
            <div>
                <NavLink
                    to={`/patientProfile/${patientId}`}
                >
                    <button className={style.finish_button}>Finish</button>
                </NavLink>
            </div>
        );

        const femaleConsentingPatient = pregnancySubStudyConsent && this.props.data.demographicData.gender !== 1;

        if (this.props.renderedInYesOrNoPage) {
            return backButtonWithoutDiv;
        }

        return (
            <div className={style.page_navigation_buttons}>
                {currentPage === '0' ? firstPageButton : null}
                {((currentPage === '10' && !femaleConsentingPatient) || (currentPage === '11' && femaleConsentingPatient))
                    ? (
                        <>
                            {backButton}
                            {finishButton}
                        </>
                    )
                    : null}
                {(((currentPage !== '10' && !femaleConsentingPatient) || (currentPage !== '11' && femaleConsentingPatient)) && currentPage !== '0')
                    ? (
                        <>
                            {backButton}
                            {nextButton}
                        </>
                    )
                    : null}
            </div>
        );
    }
}

export { FrontPageNavigationButton };

export function calcNextPage(currentPageInString) {
    const currentPage = parseInt(currentPageInString, 10);
    return currentPage + 1;
}

export function calcLastPage(currentPageInString) {
    const currentPage = parseInt(currentPageInString, 10);
    return currentPage - 1;
}
