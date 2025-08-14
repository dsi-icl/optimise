import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from './utils';
import Icon from '../icon';
import { PregnancyCard } from './pregnancyCard';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './pregnancyPage.module.css';

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile
    };
}

/**
 * @class DataTemplate
 * @description Renders the list of pregnancies
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 */

/* this component serves as a sieve for the data and pass the relevant one to the form as props */
@connect(mapStateToProps)
class PregnanciesListingPage extends Component {
    constructor(props) {
        super();
        this.state = {
            scopePregnancyId: parseInt(props.match.params.pregnancyId)
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.ceId === state.ceId)
            return state;
        return {
            ...state,
            ceId: props.match.params.ceId,
            refreshReferences: true
        };
    }

    render() {
        let scopePregnancyId;
        try {
            scopePregnancyId = parseInt(this.props.match.params.pregnancyId);
        }
        catch (__unused__) {
            // ignore
        }
        const { patientProfile, match } = this.props;
        const pregnancies = (patientProfile?.data?.pregnancy ?? [])
            .filter(pregnancy => this.state.scopePregnancyId ? pregnancy.id === scopePregnancyId : true)
            .sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate))
            .map((pregnancy, index) => {
                pregnancy.orderPosition = index;
                pregnancy.patientId = patientProfile?.data?.patientId;
                return pregnancy;
            }).reverse();

        let _style = scaffold_style;
        if (this.props.override_style) {
            _style = { ...scaffold_style, ...this.props.override_style };
        }

        if (!patientProfile.fetching) {
            if (!pregnancies.length)
                return <>
                    <div className={_style.ariane}>
                        <h2>PREGNANCIES</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={_style.panel}>
                        <i>This patient has no recorded pregnancy.</i>
                    </div>
                </>;
            else
                return <>
                    <div className={_style.ariane}>
                        <h2>PREGNANCIES</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={_style.panel}>
                        <i>
                            There
                            {pregnancies.length > 1 ? 'are' : 'is'}
                            {' '}
                            {pregnancies.length}
                            {' '}
                            pregnanc
                            {pregnancies.length > 1 ? 'ies' : 'y'}
                            {' '}
                            referenced for this participant. See the data card below for details.
                        </i>
                        <br />
                        <br />
                        <div className={style.levelBody}>
                            {pregnancies.map((pregnancy, index) => <PregnancyCard key={index} pregnancy={pregnancy} />)}
                        </div>
                    </div>
                </>;
        }
        else {
            return <div><Icon symbol="loading" /></div>;
        }
    }
}

export { PregnanciesListingPage };
