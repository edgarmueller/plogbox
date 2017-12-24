import FileReader from 'filereader';
import PropTypes from 'prop-types';
import Enzyme, { mount } from 'enzyme';
import { createMuiTheme } from 'material-ui';
import { Blob } from 'jsdom/lib/jsdom/living';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

export function mountWithContext(Component) {
  return mount(
    Component,
    {
      context: {
        muiTheme: createMuiTheme(),
      },
      childContextTypes: {
        muiTheme: PropTypes.object.isRequired,
      },
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

global.requestAnimationFrame = cb => setTimeout(cb, 0);
global.localStorage = mockStorage();
// mock for file API
global.Blob = Blob;
global.FileReader = FileReader;
global.URL.createObjectURL = () => 'TEST';
global.URL.revokeObjectURL = () => {};
