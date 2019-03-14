import React from 'react';
import {
    InteriorLeftNav,
    InteriorLeftNavItem,
    InteriorLeftNavHeader
} from 'carbon-addons-cloud-react';

import '../../style/scss/account-left-nav.scss';

const navItems = [
    {
        key: 'overview',
        suffixUrl: 'overview',
        label: 'Overview'
    },
    {
        key: 'settings',
        suffixUrl: 'settings',
        label: 'Settings'
    },
    {
        key: 'history',
        suffixUrl: 'history/overall',
        label: 'History'
    },
    {
        key: 'assets',
        suffixUrl: 'assets/approval',
        label: 'Assets'
    },
    {
        key: 'payments',
        suffixUrl: 'payments',
        label: 'Payments'
    },
    {
        key: 'offers',
        suffixUrl: 'offers/initiated',
        label: 'Offers'
    },
    {
        key: 'transactions',
        suffixUrl: 'transactions',
        label: 'Transactions'
    },
];
const getActiveHref = (hash, matchUrl) => {
    const activeNavItem = navItems.find(navItem => hash.indexOf(navItem.key) >= 0);
    return `#${matchUrl}/${activeNavItem.suffixUrl}`;
}
const AccountLeftNav = ({ match, onToggle }) =>
    <InteriorLeftNav
        className={'account-left-nav'}
        onToggle={(open) => onToggle(open)}
        activeHref={window && window.location && getActiveHref(window.location.hash, match.url)}>
        <InteriorLeftNavHeader
            icon={
                <svg
                    fillRule="evenodd"
                    height="24"
                    name="icon--containers"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <title>
                        Account icon
                    </title>
                    <path d="M21.7 5.8L13.5.4c-.9-.6-2.2-.6-3.1 0L2.2 5.9c-.4.3-.7.6-.9 1.1 0 0-.3.6-.3 1.3v7.6c0 .9.5 1.7 1.3 2.2l8.2 5.4c.5.3 1 .5 1.5.5s1.1-.2 1.6-.5l8.2-5.4c.8-.5 1.2-1.3 1.2-2.2V8.3c0-.3.1-1.5-1.3-2.5zm-18.9.9L11 1.3c.6-.4 1.4-.4 1.9 0l8.2 5.4c.3.2.6.5.7.9L16 11.2l-.4.3L13 9.6c-.6-.4-1.3-.4-1.9 0l-2.6 1.7-6.3-3.8c.1-.3.3-.6.6-.8zm11.9 5.4l-2.3 1.5c-.2.1-.5.1-.7 0L9.4 12l2.3-1.5c.2-.1.5-.1.7 0l2.3 1.6zm7.3 3.8c0 .6-.3 1.1-.8 1.4L13 22.7c-.6.4-1.4.4-1.9 0l-8.3-5.4C2.3 17 2 16.5 2 16V8.6l6.2 3.8 2.9 2c.6.4 1.3.4 1.9 0l2.9-1.9L22 8.6v7.3z" />
                </svg>
            }
        >
        Stellar account
        </InteriorLeftNavHeader>
        {navItems.map(navItem => {
            return (
                <InteriorLeftNavItem
                    key={navItem.key}
                    href={`#${match.url}/${navItem.suffixUrl}`}
                    label={navItem.label}
                />
            )
        })}
    </InteriorLeftNav>

export default AccountLeftNav;
