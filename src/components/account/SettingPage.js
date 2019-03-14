import React from 'react';
import AccountOptions from './AccountOptions';
import Signers from './Signers';
import PageHeader from './PageHeader';
import AccountAuthorization from './AccountAuthorization';
import { graphql } from 'react-apollo';
import { GET_ACCOUNT } from '../../queries/account';
import PublicKey from './PublicKey';

const SettingsPage = ({ parentState, GET_ACCOUNT }) =>
    <div>
        <PageHeader
            pageType='settings'
            publicKey={parentState.publicKey}
        />
        <PublicKey publicKey={parentState.publicKey} label='Public key' isStandAlone={true} />
        <AccountOptions parentState={parentState} data={GET_ACCOUNT} />
        <Signers parentState={parentState} data={GET_ACCOUNT} />
        <AccountAuthorization parentState={parentState} data={GET_ACCOUNT} />
    </div>

export default graphql(GET_ACCOUNT, {
    name: 'GET_ACCOUNT',
    options: ({ parentState }) => {
        return {
            variables: { publicKey: parentState.publicKey }
        };
    }
})(SettingsPage);
