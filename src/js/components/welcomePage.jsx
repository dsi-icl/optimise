import React, { Component } from 'react';
import cssTexts from '../../css/inlinetexts.css';
export class WelcomePanel extends Component {
    render() {
        return <div className={cssTexts.welcomeText}>Welcome to Optimise!</div>
    }
}