import 'carbon-components/scss/globals/scss/styles.scss';

import { HashRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './apolloclient/apolloClient';

import './style/scss/common.scss';
import Topbar from './components/layout/Topbar';
import NotificationToast from './components/utils/NotificationToast';

import Login from './components/registration/Login';
import Signup from './components/registration/Signup';
import ResetPassword from './components/registration/ResetPassword';

import Accounts from './components/account/Accounts';
import ChangePassword from './components/account/ChangePassword';
import AccountDash from './components/account/AccountDash';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/utils/PrivateRoute';

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Router>
                    <div className="app">
                        <Topbar />
                        <NotificationToast />
                        <div className='page-content-container'>
                            <Route exact={true} path="/login" component={Login} />
                            <Route exact={true} path="/signup" component={Signup} />
                            <Route exact={true} path="/resetPassword" component={ResetPassword} />
                            <PrivateRoute exact={true} path="/" component={Dashboard} />
                            <PrivateRoute exact={true} path="/changepassword" component={ChangePassword} />
                            <PrivateRoute exact={true} path="/accounts" component={Accounts} />
                            <PrivateRoute exact={true} path="/dashboard" component={Dashboard} />
                            <PrivateRoute path="/account/:publicKey" component={AccountDash} />
                        </div>
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}

export default App;
