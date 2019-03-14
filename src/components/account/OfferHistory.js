import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import moment from 'moment'
import { GET_HISTORY_OFFER } from '../../queries/account';
import { POLL_INTERVAL } from '../../libs/constants';

class OfferHistory extends Component {
    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    generateOperationType(payload) {
        let operationType = '';
        if (payload.type === 'manage_offer') {
            // If the offer_id is 0, it's a "create offer" where a brand new offer is created.
            // If the offer_id is not zero. If the amount is non-zero, the offer was updated. If the amount is zero, the offer was deleted.
            operationType = payload.offer_id === '0' ? 'Create offer' : parseFloat(payload.amount) === 0 ? 'Delete offer' : 'Update offer';
        }

        return operationType;
    }

    getRows(data) {
        let rowId = 0;
        const historyRows = [];
        data.getHistory.map(payload => {
            if (payload.type === 'manage_offer') {
                historyRows.push({
                    id: (rowId++).toString(),
                    key: payload.id,
                    ID: { type: 'string', value: payload.id },
                    sellingAsset: {
                        type: 'string',
                        value: payload.selling_asset_code
                            ? payload.selling_asset_code
                            : 'XLM'
                    },
                    sellingIssuer: {
                        type: 'string',
                        truncate: true,
                        value: payload.selling_asset_issuer
                            ? payload.selling_asset_issuer
                            : 'Native'
                    },
                    sellingAmount: {
                        type: 'string',
                        value: Number(payload.amount).toFixed(7)
                    },
                    buyingAsset: {
                        type: 'string',
                        value: payload.buying_asset_code ? payload.buying_asset_code : 'XLM'
                    },
                    buyingIssuer: {
                        type: 'string',
                        truncate: true,
                        value: payload.buying_asset_issuer
                            ? payload.buying_asset_issuer
                            : 'Native'
                    },
                    buyingAmount: {
                        type: 'string',
                        value: (payload.amount * payload.price).toFixed(7)
                    },
                    operation: { type: 'string', value: this.generateOperationType(payload) },
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
            { key: 'sellingAsset', header: 'Selling Asset' },
            { key: 'sellingIssuer', header: 'Selling Issuer' },
            { key: 'sellingAmount', header: 'Selling Amount' },
            { key: 'buyingAsset', header: 'Buying Asset' },
            { key: 'buyingIssuer', header: 'Buying Issuer' },
            { key: 'buyingAmount', header: 'Buying Amount' },
            { key: 'operation', header: 'Operation' },
            { key: 'createdAt', header: 'Created Date' }
        ];
        return headers;
    }

    render() {
        const noRecordsComponent = (
            <NoRecords
                title="Offer transactions"
                detail="You do not have any offer transactions."
            >
            </NoRecords>
        );
        return (
            <Query
                query={GET_HISTORY_OFFER}
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
                            title={'Offer transactions'}
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

export default OfferHistory;
