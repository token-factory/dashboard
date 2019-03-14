import React from 'react';
import PageHeader from './PageHeader';
import Transactions from './Transactions';

const TransactionsPage = ({ parentState }) =>
    <div>
        <PageHeader
            pageType='transactions'
            publicKey={parentState.publicKey}
        />
        <Transactions parentState={parentState} />
    </div>

export default TransactionsPage;
