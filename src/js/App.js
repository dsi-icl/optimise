import React, {Component} from 'react';
import {MenuBar, MiddlePanel, RightPanel} from './components/scaffold.jsx'; 
import css from '../css/globalDefault.css.js';


class App extends Component {
    render() {
        return (
        <div className="App" style={css.global}>
            <MenuBar/>
            <MiddlePanel/>
            <RightPanel/>
        </div>
        );
    }
}


export default App;
