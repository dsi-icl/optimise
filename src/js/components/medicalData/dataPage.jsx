import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


function mapStateToProps(state) {
    return {
        fields: state.availableFields.testFields,
        patientId: state.patientProfile.data.patientId,
        data: state.patientProfile.data.tests[0],
        dataTypes: state.availableFields.dataTypes
    }
}
@connect(mapStateToProps)
export class TestData extends Component {
    constructor() {
        super();
        this.state = { pathname: '' };
    }

    componentDidMount() { /* put this logic in patient Chart instead */
        this.setState({ pathname: window.location.pathname });
        document.getElementById(window.location.pathname).className = 'selectedResult';

    }

    componentWillUnmount() {
        if (document.getElementById(this.state.pathname)) {
            document.getElementById(this.state.pathname).classList.remove('selectedResult');
        }
    }

    render(){
        /* formating the data for easier mapping later */
        return (<div>
            <BackButton to={`/patientProfile/${this.props.patientId}`}/>
            <h2>TEST RESULT</h2> <h2>Type: 1 <br/>Date ordered: 1/1/2001 <br/> Date sample taken: </h2> 
            {formatData(this.props.data, this.props.fields, this.props.dataTypes)}
        </div>);   //change the type later
    }
}

export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', left: 20, top: 20, textAlign: 'center', fontSize: 20, width: 30, paddingTop: 4, height: 26, color: 'white', borderRadius: 20, backgroundColor: '#ff6666' }}
                >&#8617;
                </div>
            </Link>
        );
    }
}


/**
 * @function formatData
 * @example
 * // medicalElement = {
 * //     'testId': 1,
 * //     'orderedDuringVisit': 10,
 * //     'type': 2,
 * //     'expectedOccurDate': '5/6/1',
 * //     'data': [
 * //        { 'field': 64, 'value': '13' },
 * //        { 'field': 65, 'value': '12' },
 * //        { 'field': 86, 'value': '123' },
 * //        { 'field': 91, 'value' : 'TEST NOT DONE' }]}
 * @description Take the data of a test, event, or visit as sent by the backend and format it to react component / JSX for display.
 * @param {Object} medicalElement - medical element object (test, events, visits) as is from the {test, event, visit} entries from /api/patientProfile/:patientId
 * @param {Array} fieldList - the available fields as is returned from calling /api/getAvailable{testFields|eventFields,etc}
 * @param {Array} dataTypes - the datatype array returned by backend
 * @returns {JSX} Formatted data for display on frontend
 */
function formatData(medicalElement, fieldList, dataTypes) {
    const style = {
        width: '87%',
        marginTop: 30,
        marginBottom: 40,
        marginRight: 'auto',
        marginLeft: 'auto'
    };
    //reformating the field list to hash table with fieldId as key for easier lookup later without need array filter:
    const filteredFieldList = fieldList.filter(field => field.referenceType == medicalElement.type );   // eslint-disable-line eqeqeq
    const fieldHashTable = filteredFieldList.reduce((map, field) => { map[field.id] = field; return map }, {}); // eslint-disable-line indent
    //same with data:
    const dataHashTable = medicalElement.data.reduce((map, el) => { map[el.field] = el.value; return map }, {});
    //same with dataTypes:
    const dataTypesHashTable = dataTypes.reduce((map, dataType) => { map[dataType.id] = dataType.value; return map }, {});
    return (
        <div style={style}>
            {
                filteredFieldList.map(field => {
                    const { id, definition, idname, type, unit, module, permittedValues, referenceType } = field;
                    const originalValue = dataHashTable[field.id]; //assigned either the value or undefined, which is falsy, which is used below
                    const key = `${medicalElement.testId}_FIELD${id}`;
                    console.log(originalValue);
                    switch (dataTypesHashTable[type]) {   //what to return depends on the data type of the field
                        case 'I':
                            return <span key={key}>{definition}: <input originalValue={originalValue} dataType='I' type='text' value={originalValue}/><br/><br/></span>;
                        case 'F':
                            return <span key={key}>{definition}: <input originalValue={originalValue} dataType='F' type='text' value={originalValue}/><br/><br/></span>;
                        case 'C':
                            return (<span key={key}>{definition}: 
                                <select dataType='C' originalValue={originalValue} value={originalValue ? originalValue : 'unselected'}>
                                    <option value='unselected'>unselected</option>
                                    {permittedValues.split(',').map(option => <option value={option}>{option}</option>)}
                                </select>
                                <br/><br/></span>);
                        case 'T':
                            return <span key={key}>{definition}: <input originalValue={originalValue} dataType='T' type='text' value={originalValue}/><br/><br/></span>;
                        case 'B':
                            return (<span key={key}>{definition}: 
                                <select dataType='B' originalValue={originalValue} value={originalValue ? originalValue : 'unselected'}>
                                    <option value='unselected'>unselected</option>
                                    <option value='1'>True</option>
                                    <option value='0'>False</option>
                                </select>
                                <br/><br/></span>);
                        case 'BLOB':
                            return <span key={key}> BLOB<br/><br/></span>;
                        default:
                            return <span key={key}>This field cannot be displayed. Please contact admin. <br/><br/></span>;
                    }
                })
            }
        </div>
    );
}


/* 
undone:
rendering tests directly throws error
input field has to be controlled component
now the test input is hardcode
*/