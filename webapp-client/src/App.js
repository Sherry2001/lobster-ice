import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  Redirect,
  Router,
} from 'react-router-dom';

import MainPage from './pages/main';
import SignInPage from './pages/sign-in';
import NotFoundPage from './pages/404';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
