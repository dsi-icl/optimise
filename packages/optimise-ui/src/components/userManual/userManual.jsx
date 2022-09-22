import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import ImageZoom from 'react-medium-image-zoom';
import Helmet from '../scaffold/helmet';
import style from './userManual.module.css';
import markup from './userManual.md';

export default class UserManual extends Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <>
            <div className={style.ariane}>
                <Helmet title='User Manual' />
                <h2>User Manual</h2>
            </div>
            <div className={style.panel}>
                <ReactMarkdown rehypePlugins={[rehypeRaw]} components={{
                    img: ({ alt, ...imgProps }) => <ImageZoom>
                        <img alt={alt} {...imgProps} />
                    </ImageZoom>
                }}>
                    {markup}
                </ReactMarkdown>
            </div>
        </>;
    }
}
