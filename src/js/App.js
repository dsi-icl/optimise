import React, {Component} from 'react';
import {SearchPatientsById} from './components/searchPatientsById.jsx';
import {Section} from './components/patientProfile.jsx';
import css from '../css/globalDefault.css.js';


class App extends Component {
    render() {
        return (
        <div className="App" style={css.global}>
            <Section/>
        </div>
        );
    }
}


export default App;
