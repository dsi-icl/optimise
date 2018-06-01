import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        matchedNames: state.matchedNames
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatchSearchString: (searchString) => dispatch ({
            type: 'SEARCH_PATIENTS_BY_ID', payload: searchString
        })
    }
}

class SearchBarForPatientsConnect extends Component {
    constructor() {
        super();
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(){
        console.log(this)
        const searchString = 'flor';
        this.props.dispatchSearchString({searchString});
    }

    render() {
        return (
            <form>
                <input type='text' onKeyPress={this.handleKeyPress}/>
            </form>
        );
    }

}


const SearchResultForPatientsConnect = ({matchedNames}) => {
    return (
        <ul>
            {matchedNames.map(el => <li key={el}> {el} </li>)}
        </ul>
    );
}

export const SearchBarForPatients = connect(mapStateToProps, mapDispatchToProps)(SearchBarForPatientsConnect);
export const SearchResultForPatients = connect(mapStateToProps, mapDispatchToProps)(SearchResultForPatientsConnect);
