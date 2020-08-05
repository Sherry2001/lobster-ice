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
    console.log(googleUser);
    this.setLoggedIn(true);
  }

  onFailure(error) {
    // TODO: Show error message?
    console.log(error);
  }

  renderButton() {
    window.gapi.signin2.render('g-signin2', {
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: this.signIn,
      onfailure: this.onFailure,
    });
  }

  async gapiSetState() {
    try {
      this.renderButton();
      await window.gapi.auth2.init({
        client_id: process.env.REACT_APP_CLIENT_ID,
      });
      const authInstance = window.gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(this.setLoggedIn);
      this.setState({loggedIn: authInstance.isSignedIn.get()});
    } catch (error) {
      console.error(error);
      // this.showErrorMessage();
    }
  }

  setLoggedIn(loggedIn) {
    this.setState({loggedIn});
  }

  async componentDidMount() {
    await window.gapi.load('auth2', this.gapiSetState);
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
            <script
              src="https://apis.google.com/js/platform.js?onload=renderButton"
              defer
            />
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
