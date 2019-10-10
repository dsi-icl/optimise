// eslint-disable-next-line no-unused-vars
import { PureComponent } from 'react';
import { default as T } from 'prop-types';
import browserBehaviour from '../../utilities/browserBehaviour';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'draft-js/dist/Draft.css';
import './body.css';
import './datepicker.css';
import './tree.css';

export default class Body extends PureComponent {

    // Custom name for container
    static displayName = 'Body';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    componentDidMount() {
        browserBehaviour.apply();
    }

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}
