import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export class WelcomePanel extends Component {
    render() {
        const style = {
            fontFamily: 'sans-serif',
            fontSize: 50,
            textAlign: 'center',
            color: 'grey'
        }
        return <div style={style}><br/><br/>Welcome to Optimise!</div>
    }
}