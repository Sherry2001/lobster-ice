import React from 'react';
// installation: npm i react-shadow-scroll or yarn add react-shadow-scroll
import ReactShadowScroll from 'react-shadow-scroll';
import '../stylesheets/Navbar.css';

const Navbar = (props) => {
  return (
    <ReactShadowScroll>
      <ul className="nav-bar">
        <li>All</li>
        <li>France Trip</li>
        <li>Senior Trip</li>
        <li>Foods I want</li>
        <li>China</li>
      </ul>
    </ReactShadowScroll>
  );
};

export default Navbar;