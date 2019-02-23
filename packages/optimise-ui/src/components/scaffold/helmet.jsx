import React, { Component } from 'react';
import Helmet from 'react-helmet-async';
import appInfo from '../../../package.json';

export default class LocalHelmet extends Component {

    render() {
        const { title = '', description = '' } = this.props;
        return (
            <Helmet>
                <title>{appInfo.productName || 'Optimise MS'} : {title}</title>
                <meta name="description" content={description} />
            </Helmet>
        );
    }
}