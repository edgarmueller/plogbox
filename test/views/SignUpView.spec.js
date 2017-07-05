import test from 'ava';
import React from 'react';
import auth from '../../src/reducers/auth'
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Field } from 'redux-form';
import SignUpPage from '../../src/views/SignUpView'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

import { setupDom } from '../helpers/setup';

test.serial("Sign-up page should render", async t => {
    let promiseResolve, promiseReject;
    let promise = new Promise(function(resolve, reject){
        promiseResolve = resolve;
        promiseReject = reject;
    });
    let fields = 0;
    setupDom(() => {
        const store = createStore(combineReducers({form: formReducer, auth: auth}));
        const props = {
            handleSubmit() {
            },
            isAuthenticated: false
        };
        const enzymeWrapper = mount(
            <Provider store={store}>
                <SignUpPage {...props} />
            </Provider>,
            {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            }
        );
        fields = enzymeWrapper.find(Field).length;
        promiseResolve()
    });
    await promise;
    t.true(fields > 0);
});