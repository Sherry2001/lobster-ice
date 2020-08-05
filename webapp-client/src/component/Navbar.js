import logo from '../lobster-icon.jpg';
import React from 'react';
import {Redirect} from 'react-router-dom';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authInstance: null,
      redirect: false,
    };
    this.formatUser = this.formatUser.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setAuthInstance = this.setAuthInstance.bind(this);
  }

  setAuthInstance() {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      this.setState({authInstance});
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.setAuthInstance();
  }

  signOut() {
    if (this.state.authInstance) {
      this.state.authInstance.signOut();
      this.setState({redirect: true});
    }
  }

  async fetchUserId(props) {
    if (props.getUserId()) {
      return;
    }
    try {
      const user = this.state.authInstance.currentUser.get();
      const idToken = user.getAuthResponse().id_token;
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/user/authenticate',
        {
          method: 'POST',
          body: JSON.stringify({id: idToken}),
          headers: {'Content-type': 'application/json'},
        }
      );
      const userId = await response.json();
      props.setUserId(userId);
    } catch (error) {
      // TODO: Display error
      props.setUserId('error');
    }
  }

  formatUser() {
    if (this.state.authInstance) {
      this.fetchUserId(this.props);
      const user = this.state.authInstance.currentUser.get();
      const profile = user.getBasicProfile();
      return (
        <span className="navbar-item">
          {profile.getName()},&nbsp;
          <a href="#" onClick={this.signOut}>
            Sign Out
          </a>
        </span>
      );
    }
    return <div className="navbar-item g-signin2" />;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
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
        <div className="navbar-end">{this.formatUser(this.props)}</div>
      </nav>
    );
  }
}
