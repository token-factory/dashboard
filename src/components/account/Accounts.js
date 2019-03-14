import React, { Component } from 'react';
import { GET_ACCOUNTS } from '../../queries/account';
import AddAccount from './AddAccount';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import lodash from 'lodash';
import NoRecords from '../utils/NoRecords';
import moment from 'moment';
import { Button } from 'carbon-components-react';
import { POLL_INTERVAL } from '../../libs/constants'

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddNew: false
        };

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
    }

    getHeaders() {
        const headers = [
            { key: 'publicKey', header: 'Public Key', type: 'link' },
            { key: 'email', header: 'Email', type: 'string' },
            { key: 'description', header: 'Description', type: 'string' },
            { key: 'createdAt', header: 'Created Date', type: 'string' }
        ];
        return headers;
    }
    getRows(data) {
        let rowId = 0;
        const accounts = lodash.orderBy(
            data.getAccounts,
            ['createdAt'],
            ['desc']
        );
        const accountRows = accounts.map(
            ({ public_key, description, createdAt, email, home_domain }) => {
                return {
                    id: (rowId++).toString(),
                    publicKey: {
                        type: 'link',
                        link: `#/account/${public_key}/overview`,
                        value: public_key,
                        truncate: true,
                        launchLink: home_domain,
                        launchLinkDesc: 'Launch home domain'
                    },
                    email: { type: 'string', value: email },
                    description: { type: 'string', value: description },
                    createdAt: {
                        type: 'string',
                        value: moment(createdAt).format('MMM Do YYYY, h:mm a')
                    }
                };
            }
        );
        return accountRows;
    }
    handleModalState(modalState) {
        this.setState({
            showAddNew: modalState
        });
    }
    render() {
        const addNewComponent = (
            <AddAccount
                parentState={this.state}
                handleCloseAddNew={() => this.handleModalState(false)}
            />
        );
        const noRecordsComponent = (
            <NoRecords
                title="Accounts"
                detail="You do not have any accounts."
            >
                <Button onClick={() => this.handleModalState(true)}>
                    Create account
                </Button>
                {this.state.showAddNew && addNewComponent}
            </NoRecords>
        );

        return (
            <Query query={GET_ACCOUNTS} pollInterval={POLL_INTERVAL}>
                {({ loading, error, data }) => {
                    let tableStatus;
                    let headers = [];
                    let rows = [];

                    if (loading) tableStatus = 'loading';
                    else if (error) tableStatus = 'error';
                    else {
                        tableStatus = 'success';
                        headers = this.getHeaders();
                        rows = this.getRows(data);
                    }
                    const dataTableComponent = (
                        <DataTableTemplate
                            title={'Accounts'}
                            tableStatus={tableStatus}
                            addNewComponent={addNewComponent}
                            addNewButtonText="Create account"
                            addNewModalShow={this.state.showAddNew}
                            addNewClick={() => this.handleModalState(true)}
                            headers={headers}
                            rows={rows}
                        />
                    );
                    if (rows.length === 0 && (tableStatus === 'success')) {
                        return noRecordsComponent;
                    }
                    return dataTableComponent;
                }}
            </Query>
        )
    }
}

export default Accounts;
