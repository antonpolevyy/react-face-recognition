import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history';
import './App.css';

import Home from './views/Home'
import ImageInput from './views/ImageInput';
import VideoInput from './views/VideoInput'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Router history={createHistory()}> */}
        <Router history={createBrowserHistory()}>
          <div className='route'>
            <Route exact path='/' component={Home} />
            <Route exact path='/photo' component={ImageInput} />
            <Route exact path='/camera' component={VideoInput} />
          </div>
        </Router>
      </div>
    );
  }
}
