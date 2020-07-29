import logo from '../lobster-icon.jpg';
import React from 'react';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  async componentDidUpdate() {
    if (!this.props.userId && this.state.authInstance) {
      const user = this.state.authInstance.currentUser;
      const idToken = user.getAuthResponse().id_token;
      const userId = await fetch(
        process.env.REACT_APP_API_URL + 'user/authenticate',
        {
          method: 'POST',
          body: JSON.stringify({ id: idToken }),
          headers: { 'Content-type': 'application/json' },
        }
      );
      this.props.setUserId(userId);
    }
  }

  gapiSetState() {
    window.gapi.auth2.init({
      client_id: process.env.REACT_APP_CLIENT_ID,
    });
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
