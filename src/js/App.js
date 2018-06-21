import React, {Component} from 'react';
import {MenuBar, MiddlePanel, RightPanel, FarRightPanel} from './components/scaffold.jsx'; 
import css from '../css/globalDefault.css.js';


class App extends Component {
    render() {
        return (
            <div className="App" style={css.app}>
                <MenuBar/>
                <MiddlePanel/>
                <RightPanel/>
                <FarRightPanel/>
            </div>
        );
    }
}


export default App;


/*

/

/searchPatientById

/filterPatients

/patientProfile/:patientId

/administration

/exportCDISC

/patientProfile/:patientId/{test, CE, treatment, visit}?id=xxxxx

/createPatient

*/