import React, {Component} from 'react';
import {MenuBar, MiddlePanel, RightPanel, FarRightPanel} from './components/scaffold.jsx'; 
import css from '../css/globalDefault.css.js';


class App extends Component {
    render() {
        return (
            <div className="App" style={css.global}>
                <MenuBar/>
                <MiddlePanel/>
                <RightPanel/>
                <FarRightPanel/>
            </div>
        );
    }
}


export default App;
