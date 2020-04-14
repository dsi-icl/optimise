import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import qs from 'query-string';
import style from '../../frontpage.module.css';

export class FrontPageNavigationButton extends Component {
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
        } else {
            return true;
        }
    }

    _isCompulsoryPage(currentPageInString) {
        return ['1', '4'].includes(currentPageInString);
    }

    render() {
        const { params: { currentPage, visitId, patientId } } = this.props.match;
        const searchString = this.props.location.search;

        const backButton = <div>
            <NavLink
                to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcLastPage(currentPage)}${this._lastPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}
            >
                <button><b>&lt;&lt;</b> Last page</button>
            </NavLink></div>;

        const nextButton = this._isAYesOrNoPage() && !this._isCompulsoryPage(currentPage) ?
            <div>
                <button disabled style={{ visibility: 'hidden' }}>Next page (does not automatically save) <b>&gt;&gt;</b></button>
            </div>
            :
            <div>
                <NavLink
                    to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}
                >
                    <button>Next page (does not automatically save) <b>&gt;&gt;</b></button>
                </NavLink>
            </div>;

        const firstPageButton = <div>
            <NavLink
                to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}
            >
                <button>Start</button>
            </NavLink></div>;

        const finishButton = <div>
            <NavLink
                to={`/patientProfile/${patientId}`}
            >
                <button className={style.finish_button}>Finish</button>
            </NavLink></div>;

        return (
            <div className={style.page_navigation_buttons}>
                { currentPage === '0' ? firstPageButton : null }
                { currentPage === '9' ? <>{backButton}{finishButton}</> : null }
                { (currentPage !== '9' && currentPage !== '0')
                    ?
                    <>
                        {backButton}
                        {nextButton}
                    </>
                    :
                    null
                }
            </div>
        );
    }
}

export function calcNextPage(currentPageInString) {
    const currentPage = parseInt(currentPageInString, 10);
    return currentPage + 1;
}

export function calcLastPage(currentPageInString) {
    const currentPage = parseInt(currentPageInString, 10);
    return currentPage - 1;
}