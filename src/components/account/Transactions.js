import React, { Component } from 'react';

import InitiatedTransactions from './InitiatedTransactions';
import PendingTransactions from './pendingTransactions';

class Transactions extends Component {
    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
        });
    }
    render() {
        return (
            <div>
                <InitiatedTransactions parentState={this.state} />
                <PendingTransactions parentState={this.state} />
            </div>
        );
    }
}

export default Transactions;
