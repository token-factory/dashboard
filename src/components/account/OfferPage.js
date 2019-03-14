import React, { Component } from 'react';
import PageHeader from './PageHeader';
import InitiatedMyOffers from './InitiatedMyOffers';
import InitiatedMarketOffers from './InitiatedMarketOffers';
import CreateOffer from './CreateOffer';

import '../../style/scss/common.scss';
import { withRouter } from 'react-router-dom';

class OfferPage extends Component {
    changeTab(tabName) {
        this.props.history.push(tabName);
    }
    render() {
        const { parentState, match } = this.props;
        const action = match.params.action;
        const pageHeaderTabs = [
            {
                key: 'myOffers',
                label: 'My offers',
                onClick: () => this.changeTab('initiated'),
                action: 'initiated'
            },
            {
                key: 'marketOffers',
                label: 'Market offers',
                onClick: () => this.changeTab('market'),
                action: 'market'
            }
        ];
        const selectedTabIndex = pageHeaderTabs.findIndex(tab => action === tab.action);
        return (
            <div className="page-content">
                <PageHeader
                    pageType='offers'
                    publicKey={parentState.publicKey}
                    tabs={pageHeaderTabs}
                    selectedTabIndex={selectedTabIndex}
                />
                {action === 'initiated' ? (
                    <InitiatedMyOffers parentState={parentState} changeTabAction={(action) => this.changeTab(action)} />
                ) : null}
                {action === 'market' ? (
                    <InitiatedMarketOffers parentState={parentState} />
                ) : null}
                {action === 'create' ? (
                    <CreateOffer parentState={parentState} />
                ) : null}
            </div>
        );
    }
}

export default withRouter(OfferPage);
