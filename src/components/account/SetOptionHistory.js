import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import { POLL_INTERVAL } from '../../libs/constants'
import moment from 'moment'
import { GET_HISTORY_OPTION } from '../../queries/account';

class SetOptionHistory extends Component {
    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }
    generateDetailData(payload) {
        let detailData = '';
        switch (payload.__typename) {
        case 'Set_Threshold':
            detailData = [
                {
                    name: 'Master weight',
                    value: payload.master_key_weight
                },
                {
                    name: 'Low threshold',
                    value: payload.low_threshold
                },
                {
                    name: 'Medium threshold',
                    value: payload.med_threshold
                },
                {
                    name: 'High threshold',
                    value: payload.high_threshold
                }
            ];

            break;
        case 'Set_Signers':
            detailData = [
                {
                    name: 'Signer key',
                    value: payload.signer_key
                },
                {
                    name: 'Signer weight',
                    value: payload.signer_weight
                }
            ];

            break;
        case 'Account_Flags':
            detailData = this.getAccountFlags({
                flags: payload.clear_flags && payload.clear_flags.length > 0 ? payload.clear_flags_s : payload.set_flags_s,
                type: payload.clear_flags && payload.clear_flags.length > 0 ? 'clear_flags' : 'set_flags'
            });
            break;
        case 'Home_Domain':
            detailData = [{
                name: 'Home domain',
                value: payload.home_domain,
                link: true
            }];
            break;
        default:
            detailData = '';
        }

        return detailData;
    }
    getAccountFlags(data) {
        const strings = {
            auth_required: 'Auth required',
            auth_revocable: 'Auth revocable',
            auth_immutable: 'Auth immutable'
        }
        const detailData = data.flags.map(flag => {
            return {
                name: strings[flag],
                value: data.type === 'clear_flags' ? 'False' : 'True'
            }
        })
        return detailData
    }
    getRows(data) {
        let rowId = 0;
        const historyRows = [];

        data.getHistory.map(payload => {
            if (payload.type === 'set_options') {
                historyRows.push({
                    id: (rowId++).toString(),
                    key: payload.id,
                    ID: { type: 'string', value: payload.id },
                    sourceAccount: {
                        type: 'string',
                        value: payload.source_account,
                        truncate: true
                    },
                    operation: { type: 'string', value: payload.__typename },
                    details: {
                        type: 'string',
                        value: this.generateDetailData(payload)
                    },
                    createdAt: {
                        type: 'string',
                        value: moment(payload.created_at).format('MMM Do YYYY, h:mm a')
                    }
                });
            }
            return {};
        });
        return historyRows;
    }

    getHeaders() {
        const headers = [
            { key: 'ID', header: 'ID' },
            { key: 'sourceAccount', header: 'Source Account' },
            { key: 'operation', header: 'Operation' },
            { key: 'details', header: 'Details' },
            { key: 'createdAt', header: 'Created Date' }
        ];
        return headers;
    }

    render() {
        const noRecordsComponent = (
            <NoRecords
                title="Set options transactions"
                detail="You do not have any set options transactions."
            >
            </NoRecords>
        );
        return (
            <Query
                query={GET_HISTORY_OPTION}
                variables={{ publicKey: this.props.parentState.publicKey }}
                pollInterval={POLL_INTERVAL}
            >
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

                    if (rows.length === 0 && (tableStatus === 'success')) {
                        return noRecordsComponent;
                    }
                    return (
                        <DataTableTemplate
                            title={'Set options transactions'}
                            tableStatus={tableStatus}
                            headers={headers}
                            rows={rows}
                        />
                    )
                }}
            </Query>
        )
    }
}
export default SetOptionHistory;
