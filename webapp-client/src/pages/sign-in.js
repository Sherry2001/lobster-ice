import React from 'react';
import {Redirect} from 'react-router-dom';

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: null,
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.gapiSetState = this.gapiSetState.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  onSignIn(googleUser) {
    this.setLoggedIn(true);
  }

  renderButton() {
    window.gapi.signin2.render('g-signin2', {
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: this.signIn,
      onfailure: (error) => {
        console.error(error);
      },
    });
  }

  async gapiSetState() {
    try {
      this.renderButton();
      await window.gapi.auth2.init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      });
      const authInstance = window.gapi.auth2.getAuthInstance();
      const userId = await this.fetchUserId(authInstance);
      this.setState({userId, loggedIn: authInstance.isSignedIn.get()});
      authInstance.isSignedIn.listen(this.setLoggedIn);
    } catch (error) {
      // TODO: add error message rendering
      console.error(error);
    }
  }

  setLoggedIn(loggedIn) {
    this.setState({loggedIn});
  }

  async componentDidMount() {
    await window.gapi.load('auth2', this.gapiSetState);
  }

  async fetchUserId(authInstance) {
    try {
      const user = authInstance.currentUser.get();
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
      return userId;
    } catch (error) {
      // TODO: Display error
      return 'error';
    }
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <Redirect
          to={{
            pathname: '/app',
            state: {
              userId: this.state.userId,
            },
          }}
        />
      );
    }
    return (
      <div className="tile is-ancestor mt-6">
        <div className="tile is-parent columns is-centered has-text-centered">
          <div className="tile is-child box content is-4 column">
            <h1>Please sign in: </h1>
            <div className="columns is-centered my-5">
              <div id="g-signin2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
