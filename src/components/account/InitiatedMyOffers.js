import React, { Component, Fragment } from 'react';
import CreateOffer from './CreateOffer';
import { apolloClient } from '../../apolloclient/apolloClient';
import { GET_OFFERS } from '../../queries/account';
import { Switch } from 'react-router-dom';
import PrivateRoute from '../utils/PrivateRoute';
import { Button } from 'carbon-components-react';

import OfferDetail from './OfferDetail';
import DeleteOffer from './DeleteOffer';
import UpdateOffer from './UpdateOffer';
import DataTableTemplate from '../utils/DataTableTemplate';
import NoRecords from '../utils/NoRecords';
import { graphql } from 'react-apollo';
import { REQUEST_STATUS } from '../../libs/constants'

class InitiatedMyOffers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            dataRows: [],

            processStatus: ''
        };

        this.viewDetailClick = this.viewDetailClick.bind(this);
        this.deleteOfferClick = this.deleteOfferClick.bind(this);
        this.updateOfferClick = this.updateOfferClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey,
            headers: this.getHeaders()
        });
        this.fetchData();
    }

    async fetchData() {
        try {
            this.setState({
                processStatus: 'loading'
            });
            const response = await apolloClient.query({
                query: GET_OFFERS,
                variables: {
                    publicKey: this.props.parentState.publicKey
                }
            });
            const offers = response.data.getOffers;
            const dataRows = this.getDataRows(offers);
            this.setState({
                dataRows: dataRows,
                processStatus: ''
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error: ', err);
            this.setState({
                errorMsg: err,
                processStatus: ''
            });
        }
    }

    viewDetailClick(payload) {
        this.setState({
            showViewDetailModal: true,
            offerData: payload
        });
    }
    deleteOfferClick(payload) {
        this.setState({
            showDeleteOfferModal: true,
            offerData: payload
        });
    }
    updateOfferClick(payload) {
        this.setState({
            showUpdateOfferModal: true,
            offerData: payload
        });
    }
    getDataRows(offers) {
        const dataRows = offers.map(
            ({ id, selling, buying, price, amount }) => {
                const offerData = {
                    id: id,
                    offerid: id,
                    sellingassetcode: selling.asset_code
                        ? selling.asset_code
                        : 'XLM',
                    sellingissuer: selling.asset_issuer ? selling.asset_issuer : 'Native',
                    amount: amount,
                    price: price,
                    buyingassetcode: buying.asset_code
                        ? buying.asset_code
                        : 'XLM',
                    buyingissuer: buying.asset_issuer ? buying.asset_issuer : 'Native'
                };

                const action = [
                    {
                        id: 'offerDetail-action',
                        className: 'transaction-check',
                        onClick: this.viewDetailClick,
                        itemText: 'View Detail',
                        payload: offerData
                    },
                    {
                        id: 'deleteOffer-action',
                        className: 'transaction-check',
                        onClick: this.deleteOfferClick,
                        itemText: 'Delete',
                        payload: offerData
                    },
                    {
                        id: 'updateOffer-action',
                        className: 'transaction-check',
                        onClick: this.updateOfferClick,
                        itemText: 'Update',
                        payload: offerData
                    }
                ];
                return {
                    id: id,
                    offerid: { type: 'string', value: offerData.offerid },
                    sellingassetcode: {
                        type: 'string',
                        value: offerData.sellingassetcode
                    },
                    sellingissuer: {
                        type: 'string',
                        value: offerData.sellingissuer,
                        truncate: true
                    },
                    amount: { type: 'string', value: offerData.amount },
                    price: { type: 'string', value: offerData.price },
                    buyingassetcode: {
                        type: 'string',
                        value: offerData.buyingassetcode
                    },
                    buyingissuer: {
                        type: 'string',
                        value: offerData.buyingissuer,
                        truncate: true
                    },
                    action: { type: 'action', value: action }
                };
            }
        );
        return dataRows;
    }
    getHeaders() {
        const headers = [
            { key: 'offerid', header: 'Offer Id', type: 'string' },
            {
                key: 'sellingassetcode',
                header: 'Selling Asset',
                type: 'string'
            },
            { key: 'sellingissuer', header: 'Selling Issuer', type: 'string' },
            { key: 'amount', header: 'Amount', type: 'string' },
            { key: 'price', header: 'Price', type: 'string' },
            { key: 'buyingassetcode', header: 'Buying Asset', type: 'string' },
            { key: 'buyingissuer', header: 'Buying Issuer', type: 'string' },
            { key: 'action', header: '' }
        ];

        return headers;
    }

    handleCloseViewDetailModal() {
        this.setState({
            showViewDetailModal: false,
            offerid: ''
        });
    }
    handleCloseDeleteOfferModal() {
        this.setState({
            showDeleteOfferModal: false,
            offerid: ''
        });
    }
    handleCloseUpdateOfferModal() {
        this.setState({
            showUpdateOfferModal: false,
            offerid: ''
        });
    }

    render() {
        let tableStatus = REQUEST_STATUS.LOADING;
        let headers = [];
        let rows = [];

        if (this.props.GET_OFFERS.loading) {
            tableStatus = REQUEST_STATUS.LOADING;
        } else if (this.props.GET_OFFERS.error) {
            tableStatus = REQUEST_STATUS.ERROR;
        } else {
            tableStatus = REQUEST_STATUS.SUCCESS;
            headers = this.getHeaders();
            rows = this.getDataRows(this.props.GET_OFFERS.getOffers);
        }

        return (
            <Switch>
                <PrivateRoute
                    path="/account/:publicKey/offers/create"
                    component={() => <CreateOffer parentState={this.props.parentState} />}
                />
                <PrivateRoute
                    component={() => {
                        if (rows.length === 0 && (tableStatus === REQUEST_STATUS.SUCCESS)) {
                            return (
                                <NoRecords title="Offers" detail="You do not have any initiated offers.">
                                    <Button href={`#/account/${this.props.parentState.publicKey}/offers/create`}>
                                        Create offer
                                    </Button>
                                </NoRecords>
                            )
                        }

                        return (
                            <Fragment>
                                <DataTableTemplate
                                    title={'Initiated offers'}
                                    tableStatus={tableStatus}
                                    addNewButton={
                                        <Button
                                            href={`#/account/${this.props.parentState.publicKey}/offers/create`}
                                            small
                                            kind='primary'>
                                            Create offer
                                        </Button>
                                    }
                                    headers={headers}
                                    rows={rows}
                                />
                                <UpdateOffer
                                    parentState={this.state}
                                    handleCloseUpdateOfferModal={() => this.handleCloseUpdateOfferModal()}
                                />
                                <OfferDetail
                                    parentState={this.state}
                                    handleCloseViewDetailModal={() => this.handleCloseViewDetailModal()}
                                />
                                <DeleteOffer
                                    parentState={this.state}
                                    handleCloseDeleteOfferModal={() => this.handleCloseDeleteOfferModal()}
                                />
                            </Fragment>
                        )
                    }}
                />
            </Switch>
        );
    }
}

export default graphql(GET_OFFERS, {
    name: 'GET_OFFERS',
    options: props => {
        return {
            variables: {
                publicKey: props.parentState.publicKey
            }
        };
    }
})(InitiatedMyOffers);
