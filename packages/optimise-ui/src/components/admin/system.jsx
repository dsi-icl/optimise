import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import uiPackageInfo from '../../../package.json';
import style from './admin.module.css';

function mapStateToProps(state) {
    return {
        serverInfo: state.serverInfo
    };
}

@connect(mapStateToProps)
class SystemInfo extends PureComponent {
    render() {
        return (
            <>
                This system relies on <pre className={style.packageName}>optimise-core:v{this.props.serverInfo.version}</pre> and <pre className={style.packageName}>optimise-ui:v{uiPackageInfo.version}</pre>
            </>
        );
    }
}

export {SystemInfo};