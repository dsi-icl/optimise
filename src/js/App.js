import React, { Component } from 'react';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar } from './components/scaffold.jsx'; 
import css from '../css/scaffold.css';
require('react-datepicker/dist/react-datepicker-cssmodules.css');

class App extends Component {
    render() {
        return (
            <div className={css.App}>
                <MenuBar/>
                <MiddlePanel/>
                <RightPanel/>
                <FarRightPanel/>
                <StatusBar/>
            </div>
        );
    }
}


export default App;