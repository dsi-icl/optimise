import React, {Component} from 'react';
import { listOfPatients } from '../example-data-for-dev/listOfPatients';   //only for dev
import css from '../../css/searchPatientsById.css.js';

//only for dev:
const exampleResult = [{"patientId":1,"alias_id":"chon","study":"optimise","DOB":"1/4/1995","gender":"male"},{"patientId":11,"alias_id":"chons","study":"optimsie","DOB":"14/7/1994","gender":"male"},{"patientId":17,"alias_id":"iamchon","study":"optimise","DOB":null,"gender":null}];

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
                <SearchResultForPatients listOfPatients={exampleResult}/>
            </div>
        );
    }
}

class SearchResultForPatients extends Component {
    render() {
        return (
            <div>
            {this.props.listOfPatients.map(el => <div style={css.patientBanner} key={el.patientId}>{el['alias_id']} {el.study} <br/> {el.DOB} {el.gender}</div>)}
            </div>
        );
    }
}
