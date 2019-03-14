import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import moment from 'moment';
import { GET_HISTORY } from '../../queries/account';
import { POLL_INTERVAL } from '../../libs/constants';

class HistoryTable extends Component {
    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    getRows(data) {
        let rowId = 0;
        const historyRows = data.getHistory.map(payload => ({
            id: (rowId++).toString(), //ID is required for array
            transactionId: {
                type: 'tooltip',
                value: payload.transaction_hash.toUpperCase(),
                memo: payload.memo,
                truncate: true
            },
            sourceAccount: { type: 'string', value: payload.source_account, truncate: true },
            type: { type: 'string', value: payload.type },
            createdAt: { type: 'string', value: moment(payload.created_at).format('MMM Do YYYY, h:mm a') }
        }));
        return historyRows;
    }

    getHeaders() {
        const headers = [
            { key: 'transactionId', header: 'Transaction ID' },
            { key: 'sourceAccount', header: 'Source Account' },
            { key: 'type', header: 'Type' },
            { key: 'createdAt', header: 'Created Date' }
        ];
        return headers;
    }

    render() {
        const noRecordsComponent = (
            <NoRecords
                title="Overall history"
                detail="You do not have any transactions."
            >
            </NoRecords>
        );
        return (
            <Query
                query={GET_HISTORY}
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
                            title={'Transaction history overview'}
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

export default HistoryTable;
