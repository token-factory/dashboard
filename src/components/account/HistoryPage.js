import React, { Component } from 'react';
import PageHeader from './PageHeader';
import HistoryTable from './HistoryTable';
import PaymentHistory from './PaymentHistory';
import OfferHistory from './OfferHistory';
import SetOptionHistory from './SetOptionHistory';
import TrustHistory from './TrustHistory';
import { withRouter } from 'react-router-dom';

class HistoryPage extends Component {
    changeTab(tabName) {
        this.props.history.push(tabName);
    }

    render() {
        const { parentState, match } = this.props;
        const action = match.params.action;
        const pageHeaderTabs = [
            {
                key: 'overall-history',
                label: 'Overall',
                onClick: () => this.changeTab('overall'),
                action: 'overall'
            },
            {
                key: 'payment-history',
                label: 'Payments',
                onClick: () => this.changeTab('payments'),
                action: 'payments'
            },
            {
                key: 'offers-history',
                label: 'Offers',
                onClick: () => this.changeTab('offers'),
                action: 'offers'
            },
            {
                key: 'setOption-history',
                label: 'Set options',
                onClick: () => this.changeTab('setOptions'),
                action: 'setOptions'
            },
            {
                key: 'trust-history',
                label: 'Trustlines',
                onClick: () => this.changeTab('trustlines'),
                action: 'trustlines'
            },
        ];
        const selectedTabIndex = pageHeaderTabs.findIndex(tab => action === tab.action);
        const historyTabs = {
            overall: HistoryTable,
            payments: PaymentHistory,
            offers: OfferHistory,
            setOptions: SetOptionHistory,
            trustlines: TrustHistory
        };
        const HistoryTab = historyTabs[action];

        return (
            <div>
                <PageHeader
                    pageType='history'
                    publicKey={parentState.publicKey}
                    tabs={pageHeaderTabs}
                    selectedTabIndex={selectedTabIndex}
                />
                <HistoryTab parentState={parentState} changeTabAction={(action) => this.changeTab(action)} />
            </div>
        );
    }
}
export default withRouter(HistoryPage);
