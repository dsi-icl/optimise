import React, {Component} from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import css from '../../../css/patientProfile.css.js';
import {BackButton} from '../dataPage.jsx';


class PickDate extends Component {
    constructor (props) {
      super(props)
      this.state = {
        startDate: moment()
      };
      this.handleChange = this.handleChange.bind(this);
    }
   
    handleChange(date) {
      this.setState({
        startDate: date
      });
      console.log(this.props);
    }
   
    render() {
      return <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
      />;
    }
}

function parseDate(dateString) {
    const dateArr = dateString.split('/');
    if (dateArr.length === 3 && dateArr.filter(el => (Number.isInteger(el) && el > 0 ))) {
        return {day: parseInt(dateArr[0]), month: parseInt(dateArr[1]), year: parseInt(dateArr[2])};
    } else {
        throw 'wrong date format';
    }
}


class CreateVisit_toConnect extends Component {
    constructor() {
        super();
    
    }

    _handleSubmitClick() {
        
    }

    render() {
        return (<div>
                <BackButton to={`/patientProfile/${this.props.patientId}`}/>
                <h2>CREATE A NEW VISIT</h2>
                <span style={{display: 'block', width: '60%', margin:'0 auto'}}>Please enter date on which the visit occurs / occured: <br/> <span style={{display: 'block', width: '50%', margin:'0 auto'}}><PickDate/></span> </span>
                <div style={{cursor: 'pointer', textAlign: 'center', backgroundColor: 'lightgrey', borderRadius: 20, width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: 15}}>Submit</div>
            </div>);
    }
}

export const CreateVisit = connect(state => ({patientId: state.patientProfile.data.patientId}))(CreateVisit_toConnect);