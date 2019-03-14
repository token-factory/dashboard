import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import moment from 'moment'
import { GET_HISTORY_PAYMENT } from '../../queries/account';
import { POLL_INTERVAL } from '../../libs/constants';

class PaymentHistory extends Component {
    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    getRows(data) {
        let rowId = 0;
        const historyRows = [];
        data.getHistory.map(payload => {
            if (payload.type === 'payment') {
                historyRows.push({
                    id: (rowId++).toString(),
                    key: payload.id,
                    ID: {
                        type: 'tooltip',
                        value: payload.id,
                        memo: payload.memo,
                        truncate: true
                    },
                    fromAccount: { type: 'string', value: payload.from, truncate: true },
                    toAccount: { type: 'string', value: payload.to, truncate: true },
                    assetCode: {
                        type: 'string',
                        value: payload.asset_code ? payload.asset_code : 'XLM'
                    },
                    amount: { type: 'string', value: payload.amount },
                    createdAt: {
                        type: 'string',
                        value: moment(payload.created_at).format('MMM Do YYYY, h:mm a')
                    }
                });
            }
            return {};
        });
        return historyRows;
    }

    getHeaders() {
        const headers = [
            { key: 'ID', header: 'ID' },
            { key: 'fromAccount', header: 'From Account' },
            { key: 'toAccount', header: 'To Account' },
            { key: 'assetCode', header: 'Asset Code' },
            { key: 'amount', header: 'Amount' },
            { key: 'createdAt', header: 'Created Date' }
        ];
        return headers;
    }

    render() {
        const noRecordsComponent = (
            <NoRecords
                title="Payment transactions"
                detail="You do not have any payment transactions."
            >
            </NoRecords>
        );
        return (
            <Query
                query={GET_HISTORY_PAYMENT}
                variables={{ publicKey: this.props.parentState.publicKey }}
                pollInterval={POLL_INTERVAL}
            >
                {({ loading, error, data }) => {
                    let tableStatus;
                    let headers = [];
                    let rows = [];

                    if (loading) tableStatus = 'loading';
                    else if (error) tableStatus = 'error';
                    else {
                        tableStatus = 'success';
                        headers = this.getHeaders();
                        rows = this.getRows(data);
                    }

                    if (rows.length === 0 && (tableStatus === 'success')) {
                        return noRecordsComponent;
                    }
                    return (
                        <DataTableTemplate
                            title={'Payment transactions'}
                            tableStatus={tableStatus}
                            headers={headers}
                            rows={rows}
                        />
                    )
                }}
            </Query>
        )
    }
}

export default PaymentHistory;
