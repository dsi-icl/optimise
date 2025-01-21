import React, { Component } from 'react';
import ImageZoom from 'react-medium-image-zoom';
import Helmet from '../scaffold/helmet';
import style from './userManual.module.css';
import UserManualMDX from './userManual.mdx';

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
                <UserManualMDX components={{
                    img: ({ alt, ...imgProps }) => {
                        return (<ImageZoom>
                            <img alt={alt} {...imgProps} />
                        </ImageZoom>);
                    },
                    a: (aaa) => {
                        return <a href={aaa.href} target="_blank" rel="noopener noreferrer">{aaa.children}</a>;
                    }
                }} />
            </div>
        </>;
    }
}
