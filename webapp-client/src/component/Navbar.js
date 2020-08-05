import logo from '../lobster-icon.jpg';
import React from 'react';
import {Redirect} from 'react-router-dom';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.formatUser = this.formatUser.bind(this);
    this.gapiSetState = this.gapiSetState.bind(this);
    this.loadGapi = this.gapiSetState.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    // this.loadGapi();
  }

  loadGapi() {
    window.gapi.load('auth2', this.gapiSetState);
  }

  gapiSetState() {
    window.gapi.auth2.init({
      client_id: process.env.REACT_APP_CLIENT_ID,
    });
    const authInstance = window.gapi.auth2.getAuthInstance();
    this.setState({authInstance});
    authInstance.isSignedIn.listen(this.setLoggedIn);
  }

  setLoggedIn(loggedIn) {
    this.setState({loggedIn});
  }

  signOut() {
    if (this.state.authInstance) {
      this.loadGapi();
      this.state.authInstance.signOut();
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
    if (!this.state.loggedIn) {
      this.signOut();
      return <Redirect to="/" />;
    }
    if (this.state.loggedIn) {
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
