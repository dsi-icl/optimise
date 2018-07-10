import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar } from './components/scaffold.jsx'; 
import { LoginPage } from './components/login/loginPage.jsx';
import cssLogin from '../css/loginpage.css';
import { LoadingIcon } from '../statics/svg/icons.jsx';
import cssIcons from '../css/icons.css';
import cssScaffold from '../css/scaffold.css';
import { getVisitFieldsCall, getTestFieldsCall, getClinicalEventTypesCall, getTestTypesCall, getDrugsCall } from './redux/actions/availableFields.js';
require('react-datepicker/dist/react-datepicker-cssmodules.css');


@withRouter
@connect(state => ({ loggedIn: state.login.loggedIn }))
class App extends Component {
    componentWillUnmount(){
        if (this.props.loggedIn) {
            // dispatch logout
        }
    }

    render() {
        if (true) {     //if (this.props.loggedIn) {
            return <LoadingFields/>;
        } else {
            return <LoginPage/>;
        }
    }
}



function mapDispatchToProps(dispatch) {
    return {
        getVisitFieldsCall: () => dispatch(getVisitFieldsCall()),
        getTestFieldsCall: () => dispatch(getTestFieldsCall()),
        getClinicalEventTypesCall: () => dispatch(getClinicalEventTypesCall()),
        getTestTypesCall: () => dispatch(getTestTypesCall()),
        getDrugsCall: () => dispatch(getDrugsCall())
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

    }

    render(){
        if (this.props.fetching) {
            return <div className={cssLogin.loadingFields}><div className={cssIcons.spinner}><LoadingIcon/></div> Loading project data..</div>;
        } else {
            return (
                <div className={cssScaffold.App}>
                    <MenuBar/>
                    <MiddlePanel/>
                    <RightPanel/>
                    <FarRightPanel/>
                    <StatusBar/>
                </div>
            );
        }
    }
}


export default App;