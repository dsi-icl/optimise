import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class testData_toConnect extends Component {
    /* put this logic in patient Chart instead */
    constructor() {
        super();
        this.state = { pathname: '' };
    }

    componentDidMount() {
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
        const testData = this.props.data.filter(el => el.testId === 1)[0].data;    //change the id later
        const data = {};
        for (let each of testData) {
            data[each.field] = each.value;
        }
        return <div>
            <BackButton to={`/patientProfile/${this.props.patientId}`}/>
            <h2>TEST RESULT</h2> <h2>Type: 2 <br/>Date ordered: 1/1/2001 <br/> Date sample taken: </h2> {formatData(data, this.props.fields.filter(el => el['reference_type'] === 4))}
        </div>;   //change the type later
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


function formatData(dataObj, fieldsArr) {    //not done
    const wrapper = (el, dataObj, inputField) => <span key={el.id}>{el.definition}: {inputField}<br/><br/></span>;
    const style = {
        width: '87%',
        marginTop: 30,
        marginBottom: 40,
        marginRight: 'auto',
        marginLeft: 'auto'
    }
    return (
        <div style={style}>
            {fieldsArr.map(el => {
                switch(el.type) {
                case 'N':
                    return wrapper(el, dataObj, <span><input style={{ width: 50 }} type='text' value={dataObj[el.id] ? dataObj[el.id] : null}/>{el.unit === '' ? null : `  ${el.unit}`}</span>);
                case 'C':
                    const select = <select>
                        <option value='not selected' selected={dataObj[el.id] ? false : true}>not selected</option>
                        {el['permitted_values'].split(',').map(ele => (
                            <option value={ele} selected={dataObj[el.id] === ele ? true : false}>{ele}</option>
                        ))}
                    </select>;
                    return wrapper(el, dataObj, select);
                case 'I':
                    return 0;    //fix later
                default:
                    return wrapper(el, dataObj, <input type='text'></input>);
                }
            }
            )}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        fields: state.availableFields.testFields,
        patientId: state.patientProfile.data.patientId,
        data: state.patientProfile.data.tests
    }
}

export const TestData = connect(mapStateToProps)(testData_toConnect);