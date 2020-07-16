import logo from '../lobster-icon.jpg';
import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav
        className="navbar mb-1"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item">
            <img
              src={logo}
              alt="Lobster Ice Cream Logo (a cute lobster)"
              className="is-32x32"
            />
          </a>
          <a className="navbar-item">
            <h1 className="title is-4">Lobster Ice Cream</h1>
          </a>
        </div>
        <div className="navbar-end">
          {/* TODO: Put the user's actual username */}
          <div className="navbar-item">Username</div>
        </div>
      </nav>
    );
  }
}
