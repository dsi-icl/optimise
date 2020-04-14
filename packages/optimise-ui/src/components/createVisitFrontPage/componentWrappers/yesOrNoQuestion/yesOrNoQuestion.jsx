import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { calcNextPage } from '../navigationButtons/navigationButtons';
import style from './style.module.css';
import frontpage_style from '../../frontpage.module.css';
import qs from 'query-string';

export class YesOrNo extends PureComponent {
    _nextPageAnsweredYes(currentPageInString) {
        const queryParsed = qs.parse(this.props.location.search, { arrayFormat: 'comma' });
        let query_yesPages = queryParsed.yesPages;
        if (!query_yesPages) return false;
        if (typeof query_yesPages === 'string') {
            query_yesPages = [query_yesPages];
        }
        return query_yesPages.includes(calcNextPage(currentPageInString).toString());
    }

    render() {
        const { patientId, visitId, currentPage } = this.props.match.params;
        const { questionString } = this.props;
        const searchString = this.props.location.search;

        return (
            <div className={style.yes_no_div}>
                <p>{questionString}</p>
                <br/><br/><br/>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}${`${searchString},${currentPage}`}`}><button className={frontpage_style.finish_button}>Yes</button></NavLink>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${calcNextPage(currentPage)}${this._nextPageAnsweredYes(currentPage) ? '' : '/yes_or_no'}${searchString}`}><button className={style.no_button}>No</button></NavLink>
            </div>
        );
    }
}