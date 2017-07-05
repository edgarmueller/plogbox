import test from 'ava';
import React from 'react';
import {  shallow } from 'enzyme';
import NotFoundPage from '../../src/views/NotFoundView';

test("NotFoundPage should render",  t => {
    const wrapper = shallow(
        <NotFoundPage/>
    );
    const h2= wrapper.find('h2');
    t.is(h2.text(), 'Sorry, the page you requested does not exist!');
});
