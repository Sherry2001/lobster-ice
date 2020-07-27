import logo from '../lobster-icon.jpg';
import React from 'react';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    // hard-coded for now, will be fetched from db
    this.state = {
      // categoryID of the current category
      loggedIn: false,
      authInstance: null,
    };
    this.formatUser = this.formatUser.bind(this);
    this.gapiSetState = this.gapiSetState.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    window.gapi.load('auth2', this.gapiSetState);
  }

  gapiSetState() {
    window.gapi.auth2.init({
      client_id: process.env.REACT_APP_CLIENT_ID,
    });
    /* Ready. Make a call to gapi.auth2.init or some other API */
    const authInstance = window.gapi.auth2.getAuthInstance();
    this.setState({ authInstance });
    authInstance.isSignedIn.listen(this.setLoggedIn);
  }

  setLoggedIn(loggedIn) {
    this.setState({ loggedIn });
  }

  signOut() {
    this.state.authInstance.signOut();
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
        <div className="navbar-end">{this.formatUser(this.props)}</div>
      </nav>
    );
  }
}
