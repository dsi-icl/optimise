import React, {Component} from 'react';
import {SearchBarForPatients, SearchResultForPatients} from './components/searchPatientsById.js';




class App extends Component {
    render() {
        return (
        <div className="App">
            Type whatever you want!
            <SearchBarForPatients/>
            <SearchResultForPatients/>
        </div>
        );
    }
}


export default App;
