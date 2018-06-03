import React, {Component} from 'react';
import { listOfPatients } from '../example-data-for-dev/listOfPatients';   //only for dev

export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = {searchString: ''};
        this.handleKeyStroke = this.handleKeyStroke.bind(this);
    }

    handleKeyStroke(ev){
        this.setState({searchString: ev.target.value});
    }

    render(){
        const re = new RegExp(`.*${this.state.searchString}.*`);
        const matchedPatients = this.state.searchString === '' ? [] : listOfPatients.filter(name => re.test(name));
        return(
            <div>
                <form>
                    <input type='text' value={this.state.searchString} onChange={this.handleKeyStroke}/>
                </form>
                <SearchResultForPatients listOfPatients={matchedPatients}/>
            </div>
        );
    }
}

class SearchResultForPatients extends Component {
    render() {
        return (
            <ul>
                {this.props.listOfPatients.map(el => <li key={el}> {el} </li>)}
            </ul>
        );
    }
}
