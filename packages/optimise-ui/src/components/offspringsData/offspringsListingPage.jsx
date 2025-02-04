import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from './utils';
import Icon from '../icon';
import { OffspringCard } from './offspringCard';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './offspringPage.module.css';

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
        } catch (__unused__) {
            // ignore
        }
        const { patientProfile, match } = this.props;
        const offsprings = (patientProfile?.data?.offsprings ?? []).map(offspring => {
            return {
                id: offspring.id,
                pregnancyId: offspring.pregnancyId,
                data: JSON.parse(offspring.data ?? '{}')
            };
        }).filter(offspring => this.state.scopePregnancyId ? offspring.pregnancyId === scopePregnancyId : true);
        console.log(patientProfile?.data?.offsprings, this.state);
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
                        <i>This patient has no recorded offspring.</i>
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
                    </div>
                </>;
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}

export { OffspringsListingPage };