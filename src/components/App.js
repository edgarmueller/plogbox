import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './NavBar';

require('typeface-roboto');

const containerStyle = {
  width: '80%',
  margin: 'auto',
};

const App = ({ children }) => (
  <div className="app-container">
    <Navigation />
    <div id="container" style={containerStyle}>
      {children}
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default App;
