import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import * as router from 'react-router';
import { routerReducer } from 'react-router-redux'

import auth from '../../src/reducers/auth';
import App from '../../src/components/App';
import Root from '../../src/components/Root';
import NavBar from '../../src/components/NavBar';
import '../helpers/setup';
import {afterEach, beforeEach} from "../helpers/setup";

test.beforeEach(async t => await beforeEach(t));

test.afterEach(t => afterEach(t));


test.serial("App should render", t => {
    const enzymeWrapper = shallow(
        <App />,
    );
    const navBar = enzymeWrapper.find(NavBar);
    t.is(navBar.length, 1);
});

test.serial("Root should render", t => {
    router.browserHistory = {
        push: () => { },
        listen: () => { }
    };
    const store = createStore(combineReducers({
        auth: auth,
        routing: routerReducer
    }));
    const enzymeWrapper = shallow(
        <Root store={store} />
    );

    const r = enzymeWrapper.find(router.Router);
    t.deepEqual(1, r.length);
});