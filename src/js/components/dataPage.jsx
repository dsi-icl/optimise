import React, {Component} from 'react';
import { connect } from 'react-redux';

class testData_toConnect extends Component {
    render(){
        /* formating the data for easier mapping later */
        const testData = this.props.data.filter(el => el.testId === 1)[0].data;
        const data = {};
        for (let each of testData) {
            data[each.field] = each.value;
        }
        return formatData(data, this.props.fields);
    }
}

function formatData(dataObj, fieldsArr) {    //not done
    const wrapper = (el, dataObj, inputField) => <span key={el.id}>{el.definition}: {inputField}<br/><br/></span>;
    const style = {
        width: '87%',
        marginTop: 50,
        marginBottom: 40,
        marginRight: 'auto',
        marginLeft: 'auto'
    }
    return (
        <div style={style}>
            {fieldsArr.map(el => {
                    switch(el.type) {
                        case 'N':
                            return wrapper(el, dataObj, <input type='text' value={dataObj[el.id] ? dataObj[el.id] : null}/>);
                        case 'C':
                            const select = <select>
                                <option value='not selected' selected={dataObj[el.id] ? false : true}>not selected</option>
                                {el['permitted_values'].split(',').map(ele => (
                                    <option value={ele} selected={dataObj[el.id] === ele ? true : false}>{ele}</option>
                                ))}
                                </select>;
                            return wrapper(el, dataObj, select);
                        case 'I':
                            return;
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
        patientId: state.patientProfile.patientId,
        data: state.patientProfile.data.tests
    }
}

export const TestData = connect(mapStateToProps)(testData_toConnect);