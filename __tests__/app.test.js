import React from 'react';
import { App } from '../src/js/application';


describe('App suite', () => {
    it('renders in dom without crashing', () => {
        const el = mount(<App/>);
    });
});