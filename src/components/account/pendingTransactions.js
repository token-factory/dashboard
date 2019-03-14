import React, { Component } from 'react';
import { GET_TRANSACTIONS_TO_SIGN } from '../../queries/account';
import { graphql } from 'react-apollo';
import SignTransaction from './SignTransaction';
import DataTableTemplate from '../utils/DataTableTemplate';

const initialState = {
    transactionId: '',
    modalStatus: '',
    type: '',
    description: '',
    signers: ''
};
class PendingTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
        this.signTransaction = this.signTransaction.bind(this);
    }

    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
        });
    }

    getHeaders() {
        const headers = [
            { key: 'transactionId', header: 'Transaction ID' },
            { key: 'type', header: 'Type' },
            { key: 'status', header: 'Status' },
            { key: 'action', header: '' }
        ];
        return headers;
    }

    getRows(data) {
        const transactionRows = [];
        data.getTransactionsToSign.map(
            ({ id, type, source_acct, description, submitted, signers }) => {
                if (!submitted) {
                    //Only display pending transactions
                    const action = [
                        {
                            id: 'transaction-sign-action',
                            className: 'transaction-sign',
                            onClick: this.signTransaction,
                            itemText: 'Sign transaction',
                            payload: {
                                id: id,
                                type: type,
                                sourceAccount: source_acct,
                                description: description,
                                signers: signers
                            }
                        }
                    ];
                    transactionRows.push({
                        id: id,
                        transactionId: { type: 'string', value: id, truncate: true },
                        type: { type: 'string', value: type },
                        status: { type: 'string', value: submitted ? 'Sent' : 'Pending' },
                        action: { type: 'action', value: action }
                    });
                }
                return {};
            }
        );
        return transactionRows;
    }

    signTransaction(payload) {
        this.setState({
            modalStatus: 'signTransaction',
            transactionId: payload.id,
            type: payload.type,
            sourceAccount: payload.sourceAccount,
            description: payload.description,
            signers: payload.signers
        });
    }

    handleCloseSignTransaction() {
        this.setState(initialState);
    }

    render() {
        let tableStatus = 'loading';
        let headers = [];
        let rows = [];

        if (this.props.GET_TRANSACTIONS_TO_SIGN.loading) {
            tableStatus = 'loading';
        } else if (this.props.GET_TRANSACTIONS_TO_SIGN.error) {
            tableStatus = 'error';
        } else {
            if (this.props.GET_TRANSACTIONS_TO_SIGN.getTransactionsToSign.length === 0) {
                return null
            }
            tableStatus = 'success';
            headers = this.getHeaders();
            rows = this.getRows(this.props.GET_TRANSACTIONS_TO_SIGN);
        }
        return (
            <div>
                <DataTableTemplate
                    title={'Pending transactions'}
                    tableStatus={tableStatus}
                    headers={headers}
                    rows={rows}
                />
                {this.state.modalStatus === 'signTransaction' ? (
                    <SignTransaction
                        parentState={this.state}
                        handleCloseSignTransaction={() => this.handleCloseSignTransaction()}
                    />
                ) : null}
            </div>
        );
    }
}

export default graphql(GET_TRANSACTIONS_TO_SIGN, {
    name: 'GET_TRANSACTIONS_TO_SIGN',
    options: props => {
        return {
            variables: {
                publicKey: props.parentState.publicKey
            }
        };
    }
})(PendingTransactions);
