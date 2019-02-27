import React, { PureComponent } from 'react';

let timer;

export class Update extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        timer = setInterval(() => {
            this.setState({
                isUpdatableEnv: window.ipcUpdateCommander !== undefined,
                ipcUpdateReady: window.ipcUpdateReady,
                ipcUpdateStatus: window.ipcUpdateStatus
            });
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(timer);
    }

    render() {
        if (!this.state.isUpdatableEnv)
            return (
                <>
                    You are not using the desktop version of this software, please check <a href="http://optimise-ms.org">http://optimise-ms.org</a> for more information about new versions.
            </>
            );
        else
            return (
                <>
                    {}
                    {this.state.ipcUpdateReady !== undefined ? (
                        <>
                            {this.state.ipcUpdateReady}<br /><br />
                            <button onClick={() => window.ipcUpdateCommander()}>Quit and install</button>
                        </>
                    ) : this.state.ipcUpdateStatus || 'Checking for updates...'}
                </>
            );
    }
}