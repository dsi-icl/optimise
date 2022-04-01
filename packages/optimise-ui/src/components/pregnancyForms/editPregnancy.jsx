import React, { Component } from 'react';
import { PregnancyBaselineDataForm } from './pregBaselineData';
import { PregnancyPostDataForm } from './pregPostData';
import { PregnancyFollowupDataForm } from './pregFollowupData';
export class EditPregnancies extends Component {
    render() {
        const type = this.props.match.params.type;
        const renderedInFrontPage = this.props.renderedInFrontPage;
        const pregnancyId = this.props.match.params.pregnancyId;

        switch (type) {
            case 'baseline':
                return (
                    <PregnancyBaselineDataForm
                        pregnancyId={pregnancyId}
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            case 'followup':
                return (
                    <PregnancyFollowupDataForm
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            case 'term':
                return (
                    <PregnancyPostDataForm
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            default:
                return null;
        }
    }
}
