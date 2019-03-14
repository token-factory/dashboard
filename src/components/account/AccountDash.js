import React, { Component } from 'react';
import jsonwebtoken from 'jsonwebtoken';

import { Switch } from 'react-router-dom';

import AccountLeftNav from './AccountLeftNav';
import AccountPage from './AccountPage';
import HistoryPage from './HistoryPage';
import AssetPage from './AssetPage';
import TransactionsPage from './TransactionsPage';
import OfferPage from './OfferPage';
import PaymentPage from './PaymentPage';
import SettingPage from './SettingPage';

import '../../style/scss/account-dash.scss';
import PrivateRoute from '../utils/PrivateRoute';

class AccountDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: '',
            leftNavOpen: true
        };
    }

    componentWillMount() {
    // const urlParam = JSON.parse(localStorage.getItem('URL_PARAM'));
    // const publicKey = urlParam.param;
        const { publicKey } = this.props.match.params;

        const token = localStorage.getItem('authToken');
        const loggedInUser = token ? jsonwebtoken.decode(token) : {};
        this.setState({
            loggedInUser: loggedInUser,
            publicKey: publicKey
        });
    }

    computeUrl(match) {
    //TODO: this is more of a hack, might have better ways to do this
    //TODO: need to get nested Route working
        const parentPath = window.location.origin + '/#' + match.url;
        const currentPath = window.location.href;
        const start = currentPath.indexOf(parentPath);
        const end = start + parentPath.length;
        const returnUrl = currentPath.substring(0, start - 1) + currentPath.substring(end);
        return returnUrl;
    }

    onLeftNavToggle(open) {
        this.setState({ leftNavOpen: open });
    }

    render() {
        const { match } = this.props;
        const { leftNavOpen } = this.state;
        return (
            <div className='account-dash'>
                <AccountLeftNav
                    match={match}
                    onToggle={(open) => this.onLeftNavToggle(open)}
                />
                <div className={`account-dash__content${leftNavOpen ? '' : ' collapsed'}`}>
                    <Switch>
                        <PrivateRoute
                            path="/account/:publicKey/overview"
                            component={() => (
                                <AccountPage parentState={this.state} match={match} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/settings"
                            component={() => (
                                <SettingPage parentState={this.state} match={match} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/history/:action"
                            component={() => (
                                <HistoryPage parentState={this.state} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/assets/:action"
                            component={() => (
                                <AssetPage parentState={this.state} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/transactions"
                            component={() => (
                                <TransactionsPage parentState={this.state} match={match} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/offers/:action"
                            component={() => (
                                <OfferPage parentState={this.state} />
                            )}
                        />
                        <PrivateRoute
                            path="/account/:publicKey/payments"
                            component={() => (
                                <PaymentPage parentState={this.state} match={match} />
                            )}
                        />
                        <PrivateRoute
                            component={() => (
                                <AccountPage parentState={this.state} match={match} />
                            )}
                        />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default AccountDash;
