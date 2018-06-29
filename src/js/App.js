import React, { Component } from 'react';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar } from './components/scaffold.jsx'; 
import css from '../css/globalDefault.css.js';


class App extends Component {
    render() {
        return (
            <div className="App" style={css.app}>
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