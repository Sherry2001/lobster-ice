import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <nav class="navbar mb-1" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="">
            <img src={this.props.logo}
              alt="Lobster Ice Cream Logo (a cute lobster)"
              class="is-32x32" />
          </a>
          <a class="navbar-item">
            <h1 class="title is-4">Lobster Ice Cream</h1>
          </a>
        </div>
        <div class="navbar-end">
          {/* TODO: Put the user's actual username */}
          <div class="navbar-item">Username</div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
