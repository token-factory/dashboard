import React, { Component } from 'react';
import AssetSelect from '../utils/AssetSelect';
import OrderBook from './Orderbook';

import '../../style/scss/market-offers.scss';

const SELLING_ASSET = 'selling_asset';
const BUYING_ASSET = 'buying_asset'

class InitiatedMarketOffers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: this.props.parentState.publicKey,
            sellAssetCode: undefined,
            sellAssetIssuer: undefined,
            buyAssetCode: undefined,
            buyAssetIssuer: undefined
        };
    }

    assetSelect(event) {
        const asset = JSON.parse(event.target.value);
        const { asset_code, asset_issuer } = asset;
        if (asset.type === SELLING_ASSET) {
            this.setState({
                sellAssetCode: asset_code,
                sellAssetIssuer: asset_issuer
            });
        } else {
            this.setState({
                buyAssetCode: asset_code,
                buyAssetIssuer: asset_issuer
            });
        }
    }

    render() {
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, publicKey } = this.state;
        const gridContent = (
            <div className='bx--grid market-offer-grid'>
                <div className='bx--row'>
                    <div className='bx--col-md-12 pair-asset-title'>Select assets to view orderbook</div>
                </div>
                <div className='bx--row pair-asset'>
                    <AssetSelect className='bx--col-xs-12 bx--col-sm-6' title={'Selling asset'} type={SELLING_ASSET} onChange={(event) => this.assetSelect(event)} />
                    <AssetSelect className='bx--col-xs-12 bx--col-sm-6' title={'Buying asset'} type={BUYING_ASSET} onChange={(event) => this.assetSelect(event)} />
                </div>
                {sellAssetCode && sellAssetIssuer && buyAssetCode && buyAssetIssuer
                    ? <OrderBook
                        sellAssetCode={sellAssetCode}
                        sellAssetIssuer={sellAssetIssuer}
                        buyAssetCode={buyAssetCode}
                        buyAssetIssuer={buyAssetIssuer}
                        publicKey={publicKey}
                    /> : null}
            </div>
        );

        return gridContent;
    }
}
export default InitiatedMarketOffers;
