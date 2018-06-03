import React, {Component} from 'react';
import { listOfPatients } from '../example-data-for-dev/listOfPatients';   //only for dev
import css from '../../css/searchPatientsById.css.js';

//only for dev:
const exampleResult = [{"patientId":1,"alias_id":"chon","study":"optimise","DOB":"1/4/1995","gender":"male"},{"patientId":11,"alias_id":"chons","study":"optimsie","DOB":"14/7/1994","gender":"male"},{"patientId":17,"alias_id":"iamchon","study":"optimise","DOB":null,"gender":null}];

export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = {searchString: '', searchResult: []};
        this.handleKeyStroke = this.handleKeyStroke.bind(this);
    }

    handleKeyStroke(ev){
        this.setState({searchString: ev.target.value});
        fetch(`http://localhost:3001/api/patients?id=${ev.target.value}`, {
            mode: 'cors',
            headers: {'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb'}
            })
            .then(res => {console.log(res); return res.json()})
            .then(json => {console.log(json); this.setState({searchResult: json})})
            .catch(e => console.log(e))
    }

    render(){
        return(
            <div>
                <form>
                    <input type='text' value={this.state.searchString} onChange={this.handleKeyStroke}/>
                </form>
                <SearchResultForPatients listOfPatients={this.state.searchResult}/>
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
