import allowErrorMessage from '../errorify';
import logo from '../lobster-icon.jpg';
import React from 'react';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      authInstance: null,
    };
    allowErrorMessage(this);
    this.formatUser = this.formatUser.bind(this);
    this.gapiSetState = this.gapiSetState.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.onAuth2Init = this.onAuth2Init.bind(this);
  }

  componentDidMount() {
    window.gapi.load('auth2', this.gapiSetState);
  }

  gapiSetState() {
    window.gapi.auth2
      .init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      })
      .then(
        this.onAuth2Init,
        // Called if there is an init error
        this.showErrorMessage
      );
  }

  onAuth2Init() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    this.setState({authInstance, loggedIn: authInstance.isSignedIn.get()});
    authInstance.isSignedIn.listen(this.setLoggedIn);
  }

  setLoggedIn(loggedIn) {
    this.setState({loggedIn});
  }

  signOut() {
    if (this.state.authInstance) {
      this.state.authInstance.signOut();
    }
    window.location.reload();
  }

  formatUser() {
    if (this.state.loggedIn) {
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
        <div className="navbar-end">
          {this.renderErrorMessage('Error signing in')}
          {this.formatUser()}
        </div>
      </nav>
    );
  }
}
