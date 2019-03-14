import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import { Switch } from 'react-router-dom';
import CreatePayment from './CreatePayment';
import NoRecords from '../utils/NoRecords';
import PrivateRoute from '../utils/PrivateRoute';
import Button from 'carbon-components-react/lib/components/Button';
import { ALL_ASSETS } from '../../queries/account';
import { getTrustedAssets } from '../../libs/libs';

const initialState = {
    assetCode: '',
    assetIssuer: '',
};
class PaymentTable extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
    }

    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    getHeaders() {
        const headers = [
            { key: 'assetCode', header: 'Asset Code' },
            { key: 'assetIssuer', header: 'Asset Issuer' },
            { key: 'balance', header: 'Balance' }
        ];
        return headers;
    }

    getRows(data) {
        let rowId = 0;
        const paymentRows = data.map(
            ({ assetCode, assetIssuer, balance }) => {
                return {
                    id: (rowId++).toString(), //ID is required for array
                    assetCode: { type: 'string', value: assetCode },
                    assetIssuer: { type: 'string', value: assetIssuer, truncate: true },
                    balance: { type: 'string', value: balance, balance: true },
                };
            }
        );
        return paymentRows;
    }

    render() {
        const { parentState } = this.props;
        const { publicKey } = parentState;
        let tableStatus = 'loading';
        let headers = [];
        let rows = [];

        return (
            <Query query={ALL_ASSETS} variables={{ publicKey }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        tableStatus = 'loading';
                    } else if (error) {
                        tableStatus = 'error';
                    } else {
                        tableStatus = 'success';
                        const { getBalances, getAssets } = data;
                        const trustedAssets = getTrustedAssets(getBalances, getAssets, publicKey);
                        headers = this.getHeaders();
                        rows = this.getRows(trustedAssets);
                    }
                    const createPaymentButton = (
                        <Button
                            className="createPayment"
                            href={`#/account/${parentState.publicKey}/payments/create`}
                            small
                            kind='primary'
                        >
                            Make payment
                        </Button>
                    )

                    const noRecordComponent = (
                        <NoRecords
                            title="Assets"
                            detail="You do not have any assets in your account."
                        >
                            {createPaymentButton}
                        </NoRecords>
                    )
                    return (
                        <Switch>
                            <PrivateRoute
                                path="/account/:publicKey/payments/create"
                                component={() => <CreatePayment parentState={parentState} />}
                            />
                            <PrivateRoute
                                component={() => (
                                    (tableStatus === 'success' && rows.length === 0) ? noRecordComponent : (
                                        <DataTableTemplate
                                            title={'Account balance'}
                                            tableStatus={tableStatus}
                                            addNewButton={createPaymentButton}
                                            headers={headers}
                                            rows={rows}
                                            gridView={true}
                                            publicKey={this.state.publicKey}
                                        />
                                    )
                                )}
                            />
                        </Switch>
                    );
                }}
            </Query>
        )
    }
}

export default PaymentTable;
