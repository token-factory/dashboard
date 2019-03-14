import React, { Component } from 'react'
import { Query } from 'react-apollo';
import { GET_ORDER_BOOK } from '../../queries/account';
import { POLL_INTERVAL, ORDERBOOK_CONFIG } from '../../libs/constants';
import { InlineLoading, InlineNotification } from 'carbon-components-react';

import '../../style/scss/orderbook.scss';
import MatchOffer from './MatchOffer';
import BarChart from '../utils/BarChart';

const initialState = {
    payload: {},
    modalStatus: false,
}

class Orderbook extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.getMaxAmount = this.getMaxAmount.bind(this);
    }

    getMaxAmount(orders) {
        let maxAmount = Number.NEGATIVE_INFINITY;
        if (!orders || orders.length === 0) return maxAmount;
        orders.forEach(order => {
            if (order.amount > maxAmount) {
                maxAmount = order.amount;
            }
            return null;
        });
        return maxAmount;
    }

    handleBarClick(price, amount, offer) {
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer } = this.props;
        let payload;
        if (offer === ORDERBOOK_CONFIG.BIDS) { //willing to buy, create sell offer
            payload = {
                sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, price, amount, offer
            }
        } else { //willing to sell, create buy offer
            payload = {
                buyAssetCode, buyAssetIssuer, sellAssetCode, sellAssetIssuer, price, amount, offer
            }
        }
        this.setState({ payload: payload, modalStatus: true });
    }

    handleCloseMatchOfferModal() {
        this.setState(initialState);
    }

    render() {
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, publicKey } = this.props;

        const EmptyOrderbookNotification = (
            <InlineNotification
                className='empty-search'
                kind='info'
                title='No offers found.'
                subtitle='Try changing selected assets.'
                iconDescription='empty search notification'
            />
        )

        const OrderbookErrorNotification = (
            <InlineNotification
                kind='error'
                title='Error'
                subtitle='An unexpected error occured. Please try again.'
            />
        )

        return (
            <Query
                query={GET_ORDER_BOOK}
                variables={{
                    sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer
                }}
                pollInterval={POLL_INTERVAL}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <InlineLoading description='Loading orderbook...' />;
                    } else if (error) {
                        return OrderbookErrorNotification;
                    } else {
                        const { getOrderbook } = data;
                        const { asks, bids } = getOrderbook;
                        const { payload, modalStatus } = this.state;
                        const { LEFT_ORIENTED, RIGHT_ORIENTED } = ORDERBOOK_CONFIG;
                        return (
                            <div>
                                {/* Match Offer Modal */}
                                {modalStatus ? (<MatchOffer
                                    payload={payload}
                                    publicKey={publicKey}
                                    handleCloseMatchOfferModal={() => this.handleCloseMatchOfferModal()}
                                />) : null}
                                <div className='bx--row orderbook-title-row'>
                                    <div className='bx--col-xl-12 orderbook-title'>
                                        Orderbook
                                    </div>
                                </div>
                                {asks.length === 0 && bids.length === 0 ? (
                                    <div className='bx--row'>
                                        <div className='bx--col-md-12 orderbook-empty-row'>
                                            {EmptyOrderbookNotification}
                                        </div>
                                    </div>
                                ) : (<div className='bx--row'>
                                    {/* Bids */}
                                    <div className='bids-card bx--col-md-12 bx--col-xl-6'>
                                        <div className='bids-header'>
                                            <div className='bids-amount'>Amount</div>
                                            <div className='bids-price'>{`Bids (${sellAssetCode})`}</div>
                                        </div>
                                        <BarChart data={bids} orientation={LEFT_ORIENTED} handleBarClick={(price, amount, offer) => this.handleBarClick(price, amount, offer)} />
                                    </div>
                                    {/* Asks */}
                                    <div className='asks-card bx--col-md-12 bx--col-xl-6'>
                                        <div className='asks-header'>
                                            <div className='asks-price'>{`Asks (${sellAssetCode})`}</div>
                                            <div className='asks-amount'>Amount</div>
                                        </div>
                                        <BarChart data={asks} orientation={RIGHT_ORIENTED} handleBarClick={(price, amount, offer) => this.handleBarClick(price, amount, offer)} />
                                    </div>
                                </div>)}
                            </div>);
                    }
                }}
            </Query>
        )
    }
}
export default Orderbook
