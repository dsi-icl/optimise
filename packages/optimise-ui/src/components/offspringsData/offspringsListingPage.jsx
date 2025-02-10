import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from './utils';
import Icon from '../icon';
import { OffspringCard } from './offspringCard';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './offspringPage.module.css';
import history from '../../redux/history';

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile
    };
}


/**
 * @class DataTemplate
 * @description Renders the list of offsprings
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 */

/* this component serves as a sieve for the data and pass the relevant one to the form as props*/
@connect(mapStateToProps)
class OffspringsListingPage extends Component {

    constructor(props) {
        super();
        this.state = {
            scopePregnancyId: props.match.params.pregnancyId ? parseInt(props.match.params.pregnancyId) : null
        };
    }

    render() {
        const { patientProfile, match } = this.props;
        const { scopePregnancyId } = this.state;

        const isFromPregnancyView = window.location.search === '?fromPregnancy';
        const offsprings = (patientProfile?.data?.offsprings ?? []).map(offspring => {
            return {
                id: offspring.id,
                pregnancyId: offspring.pregnancyId,
                data: JSON.parse(offspring.data ?? '{}')
            };
        }).filter(offspring => {
            if (scopePregnancyId)
                return offspring.pregnancyId === scopePregnancyId;
            return patientProfile.data?.pregnancy?.map(pregnancy => pregnancy.id).includes(offspring.pregnancyId);
        });

        const pregnancy = (patientProfile?.data?.pregnancy ?? []);
        offsprings.forEach(offspring => {
            const pregnancyData = pregnancy.find(p => p.id === offspring.pregnancyId);
            if (pregnancyData) {
                offspring.pregnancy = pregnancyData;
            }
        });
        let _style = scaffold_style;
        if (this.props.override_style) {
            _style = { ...scaffold_style, ...this.props.override_style };
        }
        if (!patientProfile.fetching) {
            if (!offsprings.length)
                return <>
                    <div className={_style.ariane}>
                        <h2>OFFSPRINGS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={_style.panel}>
                        <i>This patient has no recorded offspring. You may want to fill the pregnancy questionnaire during the next visit to provide the number of offsprings</i>
                        <br />
                        <br />
                        {isFromPregnancyView
                            ? <button type='button' onClick={() => history.push(`/patientProfile/${match.params.patientId}/pregnancy/`)}>Go back to the pregnancies list</button>
                            : null}
                    </div>
                </>;
            else
                return <>
                    <div className={_style.ariane}>
                        <h2>OFFSPRINGS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={_style.panel}>
                        <i>There {offsprings.length > 1 ? 'are' : 'is'}  {offsprings.length} registered offspring{offsprings.length > 1 ? 's' : ''} for this participant{scopePregnancyId ? ' and this particular pregnancy' : ''}. See the data card below for details.</i>
                        <br />
                        <br />
                        <div className={style.levelBody}>
                            {offsprings.map((offspring, index) => <OffspringCard key={index} offspring={offspring} />)}
                        </div>
                        {isFromPregnancyView
                            ? <button type='button' onClick={() => history.push(`/patientProfile/${match.params.patientId}/pregnancy/`)}>Go back to the pregnancies list</button>
                            : null}
                    </div>
                </>;
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}

export { OffspringsListingPage };