import React from 'react';
import {Redirect} from 'react-router-dom';

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authInstance: null,
      loggedIn: false,
      userId: null,
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.gapiInit = this.gapiInit.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.gapiSetState = this.gapiSetState.bind(this);
    this.signIn = this.signIn.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  signIn() {
    // this.setState({loggedIn: true});
    // this.state.loggedIn = true;
  }

  onSignIn(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    this.signIn();
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

  gapiSetState() {
    window.gapi.auth2.init({
      client_id: process.env.REACT_APP_CLIENT_ID,
    });
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.isSignedIn.listen(this.setLoggedIn);
    this.setState({authInstance});
  }

  setLoggedIn(loggedIn) {
    this.setState({loggedIn});
  }

  async gapiInit() {
    window.gapi.load('auth2', this.gapiSetState);
    this.renderButton();
  }

  async componentDidMount() {
    const clientIdTag = document.createElement('meta');
    clientIdTag.name = 'google-signin-client_id';
    clientIdTag.content = process.env.REACT_APP_CLIENT_ID;
    document.head.appendChild(clientIdTag);
    window.gapiInit = this.gapiInit;
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=gapiInit';
    document.body.appendChild(script);
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <Redirect
          to={{
            pathname: '/app',
            state: {
              userId: this.state.userId,
              authInstance: this.state.authInstance,
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
