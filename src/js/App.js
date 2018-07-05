import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar } from './components/scaffold.jsx'; 
import css from '../css/scaffold.css';
import { LoginPage } from './components/login/loginPage.jsx';
require('react-datepicker/dist/react-datepicker-cssmodules.css');

@connect(state => ({ loggedIn: state.login.loggedIn }))
class App extends Component {
    render() {
        if (this.props.loggedIn) {
            return <div>HOOYA</div>;
            // return (
            //     <div className={css.App}>
            //         <MenuBar/>
            //         <MiddlePanel/>
            //         <RightPanel/>
            //         <FarRightPanel/>
            //         <StatusBar/>
            //     </div>
            // );
        } else {
            return <LoginPage/>;
        }
    }
}


export default App;