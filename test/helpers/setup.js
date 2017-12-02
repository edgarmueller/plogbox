import jsdom from 'jsdom';
import ReactDOM from 'react-dom';
import FileReader from 'filereader';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { createMuiTheme } from 'material-ui';
import { Blob, URL } from 'jsdom/lib/jsdom/living';
import TOKEN from './token';

global.requestAnimationFrame = cb => setTimeout(cb, 0);

export function mountWithContext(t, Component) {
  return mount(
    Component,
    {
      context: {
        muiTheme: createMuiTheme(),
      },
      childContextTypes: {
        muiTheme: PropTypes.object.isRequired,
      },
      attachTo: t.context.div,
    },
  );
}

function mockStorage() {
  const storage = {};
  return {
    setItem(key, value) {
      storage[key] = value || '';
    },
    getItem(key) {
      return storage[key];
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
}

export function afterEach(t) {
  t.context.sandbox.restore();
  const node = document.querySelector('#integration_test_div');
  if (node) {
    ReactDOM.unmountComponentAtNode(node);
  }
  window.close();
}

export function setupDom(cb) {
  // if (typeof document !== 'undefined') {
  //     return;
  // }
  const config = {
    html: '<html><head></head><body><</body></html>',
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script'],
      MutationEvents: '2.0',
    },
    scripts: [],
    onload(err, window) {
    },
    created(err, window) {
    },
    done(err, window) {
      if (err) {
        callback(err);
      }

      global.window = window;
      global.document = window.document;
      global.navigator = window.navigator;
      global.Blob = Blob;
      global.URL = URL;
      global.URL.createObjectURL = (_blob) => {
        const url = 'TEST';
        return url;
      };
      global.URL.revokeObjectURL = (_blob) => {
      };
      global.FileReader = FileReader;
      cb();
    },
  };
  jsdom.env(config);
}


export async function beforeEach(t) {
  t.context.sandbox = sinon.sandbox.create();
  if (typeof localStorage === 'undefined' || localStorage === null) {
    global.localStorage = mockStorage();
    global.localStorage.setItem('token', TOKEN);
    global.sessionStorage = mockStorage();
  }
  let div;
  let promiseResolve;
  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
  });
  setupDom(() => {
    div = document.createElement('div');
    div.setAttribute('id', 'integration_test_div');
    document.body.appendChild(div);
    t.context.div = div;
    promiseResolve();
  });
  await promise;
}
