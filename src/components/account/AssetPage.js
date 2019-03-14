import React, { Component } from 'react';
import PageHeader from './PageHeader';
import MyIssuingAssets from './MyIssuingAssets';
import MarketAssets from './MarketAssets';
import { withRouter } from 'react-router-dom';

class AssetPage extends Component {
    changeTab(tabName) {
        this.props.history.push(tabName);
    }

    render() {
        const { parentState, match } = this.props;
        const action = match.params.action;
        const pageHeaderTabs = [
            {
                key: 'myAssets',
                label: 'Approval assets',
                onClick: () => this.changeTab('approval'),
                action: 'approval'
            },
            {
                key: 'marketAssets',
                label: 'Market assets',
                onClick: () => this.changeTab('market'),
                action: 'market'
            }
        ];
        const selectedTabIndex = pageHeaderTabs.findIndex(tab => action === tab.action);
        const assetTabs = {
            approval: MyIssuingAssets,
            market: MarketAssets,
        };
        const AssetTab = assetTabs[action];
        return (
            <div>
                <PageHeader
                    pageType='assets'
                    publicKey={parentState.publicKey}
                    tabs={pageHeaderTabs}
                    selectedTabIndex={selectedTabIndex}
                />
                <AssetTab parentState={parentState} changeTabAction={(action) => this.changeTab(action)} />
            </div>
        );
    }
}

export default withRouter(AssetPage);
