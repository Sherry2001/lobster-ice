import React from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import Navbar from './component/Navbar';

function App() {
  return (
    <div className="App">
      <h1>Lobster Ice Cream</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <Navbar />
    </div>
  );
}

export default App;
