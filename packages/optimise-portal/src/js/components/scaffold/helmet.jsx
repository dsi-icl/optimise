import React, { Component } from 'react';
import Helmet from 'react-helmet';
import appInfo from '../../../../package.json';

export default class LocalHelmet extends Component {

    render() {
        const { title = '', description = '' } = this.props;
        return (
            <Helmet>
                <title>{appInfo.productName} : {title}</title>
                <meta name="description" content={description} />
            </Helmet>
        );
    }
}