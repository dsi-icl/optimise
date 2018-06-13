import React, {Component} from 'react';
import { connect } from 'react-redux';

class testData_toConnect extends Component {
    render(){
        return (
            <div>
                {this.props.fields.map(el => 
                    <span key={el.id}>{el.definition}: <br/></span>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        fields: state.availableFields.testFields,
        patientId: state.patientProfile.patientId,
        data: state.patientProfile.data.tests
    }
}

export const TestData = connect(mapStateToProps)(testData_toConnect);