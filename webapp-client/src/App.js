import React from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import './stylesheets/bulma.min.css';
import Navbar from './component/Navbar';
import ContentPane from './component/ContentPane';

function App() {
  return (
    <div className="App">
      <h1>Lobster Ice Cream</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <div class="columns">
        <ContentPane />
      </div>
    </div>
  );
}

export default App;
