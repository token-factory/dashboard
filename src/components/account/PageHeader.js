import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    Tab,
    Icon
} from 'carbon-components-react';
import { graphql } from 'react-apollo';
import { GET_ACCOUNT } from '../../queries/account';
import '../../style/scss/page-header.scss';
import lodash from 'lodash'

const getBreadcrumbText = accountData => {
    if (accountData.loading) {
        return 'Loading...'
    } else if (accountData.getAccount) {
        return (accountData.getAccount && accountData.getAccount.description) || 'Information not available'
    } else {
        return 'Information not available'
    }
}
const PageHeader = ({ pageType, tabs, publicKey, GET_ACCOUNT, selectedTabIndex }) => {
    return (
        <header data-detail-page-header className={`bx--detail-page-header bx--detail-page-header--with-tabs${tabs ? '' : ' no-tabs'}`}>
            <div className="bx--detail-page-header-content">
                <Breadcrumb>
                    <BreadcrumbItem href={'#/accounts'}>Accounts</BreadcrumbItem>
                    <BreadcrumbItem href={`#/account/${publicKey}/overview`}>
                        {getBreadcrumbText(GET_ACCOUNT)}
                    </BreadcrumbItem>
                    {pageType !== 'overview' && <BreadcrumbItem href={`#/account/${publicKey}/${pageType}`}>
                        {lodash.upperFirst(pageType)}
                    </BreadcrumbItem>}
                </Breadcrumb>
                <div className="bx--detail-page-header-title-container">
                    <div className="bx--detail-page-header-icon-container">
                        <Icon
                            name="block-chain"
                            width="25px"
                            height="25px"
                            description="Blockchain icon" />
                    </div>
                    <h1 className="bx--detail-page-header-title">{lodash.upperFirst(pageType)}</h1>
                </div>
                {tabs && <Tabs selected={selectedTabIndex}>
                    {tabs.map(tab => (
                        <Tab key={tab.key} label={tab.label} onClick={() => tab.onClick()} />
                    ))}
                </Tabs>}
            </div>
        </header>
    )
}

export default graphql(GET_ACCOUNT, {
    name: 'GET_ACCOUNT',
    options: props => {
        return {
            variables: {
                publicKey: props.publicKey
            }
        };
    }
})(PageHeader);
