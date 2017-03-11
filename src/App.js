import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import config from '../config.json';
import LinkInput from './components/LinkInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="container">
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <LinkInput />
        </div>
      </div>
    );
  }
}

export default App;
export const endpoint = process.env.NODE_ENV === 'development' ?
  config.endpointDev : config.endpointProd;
