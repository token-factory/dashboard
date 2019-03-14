import React, { Component } from 'react';
import { GET_INITIATED_TRANSACTIONS } from '../../queries/account';
import TransactionDetail from './TransactionDetail';
import { graphql } from 'react-apollo';
import DataTableTemplate from '../utils/DataTableTemplate';
import NoRecords from '../utils/NoRecords';

class InitiatedTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkTransaction: false
        };

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
        this.checkTransaction = this.checkTransaction.bind(this);
    }

    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
        });
    }

    getHeaders() {
        const headers = [
            { key: 'transactionId', header: 'Transaction Id' },
            { key: 'type', header: 'Type' },
            { key: 'status', header: 'Status' },
            { key: 'action', header: '' }
        ];
        return headers;
    }

    getRows(data) {
        const transactionRows = [];
        data.getInitiatedTransactions.map(
            ({ id, type, description, submitted, signers }) => {
                const action = [
                    {
                        id: 'transaction-details',
                        className: 'transaction-check',
                        onClick: this.checkTransaction,
                        itemText: 'View detail',
                        payload: {
                            id: id,
                            type: type,
                            description: description,
                            signers: signers
                        }
                    }
                ];
                if (!submitted) {
                    transactionRows.push({
                        id: id,
                        transactionId: { type: 'string', value: id, truncate: true },
                        type: { type: 'string', value: type },
                        status: { type: 'string', value: 'Pending' },
                        action: { type: 'action', value: action }
                    });
                }
                return null;
            }
        );

        return transactionRows;
    }

    checkTransaction(payload) {
        this.setState({
            checkTransaction: true,
            transactionId: payload.id,
            type: payload.type,
            description: payload.description,
            signers: payload.signers
        });
    }

    handleCloseCheckTransaction() {
        this.setState({
            checkTransaction: false,
            transactionId: '',
            type: '',
            description: '',
            signers: []
        });
    }

    render() {
        let tableStatus = 'loading';
        let headers = [];
        let rows = [];

        if (this.props.GET_INITIATED_TRANSACTIONS.loading) {
            tableStatus = 'loading';
        } else if (this.props.GET_INITIATED_TRANSACTIONS.error) {
            tableStatus = 'error';
        } else {
            rows = this.getRows(this.props.GET_INITIATED_TRANSACTIONS);
            if (rows.length === 0) {
                return (
                    <NoRecords
                        title='Transactions'
                        detail='You do not have any transactions.'>
                    </NoRecords>
                )
            }
            tableStatus = 'success';
            headers = this.getHeaders();
        }
        return (
            <div className="table">
                <DataTableTemplate
                    title={'Initiated transactions'}
                    tableStatus={tableStatus}
                    headers={headers}
                    rows={rows}
                />
                <TransactionDetail
                    parentState={this.state}
                    handleCloseCheckTransaction={() => this.handleCloseCheckTransaction()}
                />
            </div>
        );
    }
}

export default graphql(GET_INITIATED_TRANSACTIONS, {
    name: 'GET_INITIATED_TRANSACTIONS',
    options: props => {
        return {
            variables: {
                publicKey: props.parentState.publicKey
            }
        };
    }
})(InitiatedTransactions);
