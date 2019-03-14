import React from 'react';
import PageHeader from './PageHeader';
import AccountOverview from './AccountOverview';

const AccountPage = ({ parentState }) =>
    <div>
        <PageHeader
            pageType='overview'
            publicKey={parentState.publicKey}
        />
        <AccountOverview parentState={parentState} />
    </div>

export default AccountPage;
