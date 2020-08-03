import React, { useEffect } from 'react';
// import Navbar from '../component/Navbar';

const SignInPage = () => {
  useEffect(() => {
    function onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    }
    function onFailure(error) {
      // TODO: Show error message?
      console.log(error);
    }
    window.renderButton = function () {
      window.gapi.signin2.render('my-signin2', {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: onSuccess,
        onfailure: onFailure,
      });
    };
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=renderButton';
    document.body.appendChild(script);
    const clientIdTag = document.createElement('meta');
    clientIdTag.name = 'google-signin-client_id';
    clientIdTag.content = process.env.REACT_APP_CLIENT_ID;
    document.head.appendChild(clientIdTag);
  });

  return (
    <div className="content">
      <script
        src="https://apis.google.com/js/platform.js?onload=renderButton"
        defer
      />
      <h1>Please sign in: </h1>
      <div id="my-signin2"></div>
    </div>
  );
};

export default SignInPage;
