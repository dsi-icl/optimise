import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FarRightPanel, MenuBar, MiddlePanel, RightPanel, StatusBar } from './components/scaffold';
import Body from './components/body';
import Login from './components/login';
import { whoami } from './redux/actions/login';
import { getCEFieldsCall, getClinicalEventTypesCall, getDemoCall, getDiagnosesCall, getDrugsCall, getInterruptionReasonsCall, getMeddraCall, getPregnancyOutcomesCall, getRelationCall, getTestFieldsCall, getTestTypesCall, getVisitFieldsCall } from './redux/actions/availableFields';
import { LoadingIcon } from '../statics/svg/icons';
import cssIcons from '../css/icons.module.css';

@withRouter
@connect(state => ({ loggedIn: state.login.loggedIn, checking: state.login.initialCheckingStatus }), dispatch => ({ whoami: () => dispatch(whoami()) }))
class App extends Component {

    componentDidMount() {
        this.props.whoami();
    }

    componentWillUnmount() {
        if (this.props.loggedIn) {
            // dispatch logout
        }
    }

    render() {
        return (
            <Body>
                {this.props.checking ? <LoadingIcon /> : this.props.loggedIn ? <LoadingFields /> : <Login />}
            </Body>
        );
    }
}



function mapDispatchToProps(dispatch) {
    return {
        getVisitFieldsCall: () => dispatch(getVisitFieldsCall()),
        getTestFieldsCall: () => dispatch(getTestFieldsCall()),
        getClinicalEventTypesCall: () => dispatch(getClinicalEventTypesCall()),
        getTestTypesCall: () => dispatch(getTestTypesCall()),
        getDrugsCall: () => dispatch(getDrugsCall()),
        getDemoCall: () => dispatch(getDemoCall()),
        getRelationCall: () => dispatch(getRelationCall()),
        getDiagnosesCall: () => dispatch(getDiagnosesCall()),
        getCEFieldsCall: () => dispatch(getCEFieldsCall()),
        getPregnancyOutcomesCall: () => dispatch(getPregnancyOutcomesCall()),
        getMeddraCall: () => dispatch(getMeddraCall()),
        getInterruptionReasonsCall: () => dispatch(getInterruptionReasonsCall())
    };
}
@withRouter
@connect(state => ({ fetching: state.availableFields.fetching }), mapDispatchToProps)
class LoadingFields extends Component {
    componentDidMount() {
        this.props.getVisitFieldsCall();
        this.props.getTestFieldsCall();
        this.props.getClinicalEventTypesCall();
        this.props.getTestTypesCall();
        this.props.getDrugsCall();
        this.props.getDemoCall();
        this.props.getRelationCall();
        this.props.getDiagnosesCall();
        this.props.getCEFieldsCall();
        this.props.getPregnancyOutcomesCall();
        this.props.getMeddraCall();
        this.props.getInterruptionReasonsCall();

    }

    render() {
        if (this.props.fetching) {
            return <div className={cssIcons.spinner}><LoadingIcon /></div>;
        } else {
            return (
                <>
                    <MenuBar />
                    <MiddlePanel />
                    <RightPanel />
                    <FarRightPanel />
                    <StatusBar />
                </>
            );
        }
    }
}


export default App;