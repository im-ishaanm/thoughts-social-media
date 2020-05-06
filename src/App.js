import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Material UI stuff
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

// Pages
import home from './pages/home';
import signup from './pages/signup';
import login from './pages/login';
import user from './pages/user';
// Styles
import './App.css';

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://asia-east2-thoughts-17ad7.cloudfunctions.net/api";

const userToken = localStorage.FBIdToken;
if (userToken) {
  const decodedToken = jwtDecode(userToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = userToken;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={home} />
              <AuthRoute exact path='/login' component={login} />
              <AuthRoute exact path='/signup' component={signup} />
              <Route exact path="/user/:handle" component={user} />
              <Route exact path="/user/thought/:thoughtId" component={user} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
