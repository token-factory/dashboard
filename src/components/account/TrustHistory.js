import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import moment from 'moment'
import { POLL_INTERVAL } from '../../libs/constants'
import { GET_HISTORY_TRUST } from '../../queries/account';

class TrustHistory extends Component {
    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    getRows(tableType, data) {
        let rowId = 0;
        const historyRows = [];
        data.getHistory.forEach(payload => {
            if (payload.type === tableType) {
                const rowObj = {
                    id: (rowId++).toString(),
                    key: payload.id,
                    ID: { type: 'string', value: payload.id, truncate: true },
                    trustor: { type: 'string', value: payload.trustor, truncate: true },
                    trustee: { type: 'string', value: payload.trustee, truncate: true },
                    assetCode: { type: 'string', value: payload.asset_code },
                    assetIssuer: {
                        type: 'string',
                        value: payload.asset_issuer,
                        truncate: true
                    },
                    createdAt: {
                        type: 'string',
                        value: moment(payload.created_at).format('MMM Do YYYY, h:mm a')
                    }
                };
                if (payload.type === 'change_trust') {
                    rowObj.limit = { type: 'string', value: payload.limit };
                } else {
                    rowObj.authorize = { type: 'string', value: payload.authorize === true ? 'True' : 'False' };
                }
                historyRows.push(rowObj);
            }
            return {};
        });
        return historyRows;
    }

    getHeaders(tableType) {
        const headers = [
            { key: 'ID', header: 'ID' },
            { key: 'trustor', header: 'Truster' },
            { key: 'trustee', header: 'Trustee' },
            { key: 'assetCode', header: 'Asset Code' },
            { key: 'assetIssuer', header: 'Asset Issuer' },
            { key: 'createdAt', header: 'Created Date' }
        ];
        const uniqueHeader = tableType === 'change_trust'
            ? { key: 'limit', header: 'Limit' }
            : { key: 'authorize', header: 'Authorize' };
        headers.splice(5, 0, uniqueHeader)
        return headers;
    }

    render() {
        const noRecordsComponent = (
            <NoRecords
                title="Trustline transactions"
                detail="You do not have any trustline transactions."
            >
            </NoRecords>
        );
        return (
            <Query
                query={GET_HISTORY_TRUST}
                variables={{ publicKey: this.props.parentState.publicKey }}
                pollInterval={POLL_INTERVAL}
            >
                {({ loading, error, data }) => {
                    let tableStatus;
                    let changeTrustHeaders = [];
                    let changeTrustRows = [];
                    let allowTrustHeaders = [];
                    let allowTrustRows = [];

                    if (loading) tableStatus = 'loading';
                    else if (error) tableStatus = 'error';
                    else {
                        tableStatus = 'success';
                        changeTrustHeaders = this.getHeaders('change_trust');
                        changeTrustRows = this.getRows('change_trust', data);
                        allowTrustHeaders = this.getHeaders('allow_trust');
                        allowTrustRows = this.getRows('allow_trust', data);
                    }

                    if (changeTrustRows.length === 0 && allowTrustRows.length === 0 && (tableStatus === 'success')) {
                        return noRecordsComponent;
                    }
                    return (
                        <div>
                            {changeTrustRows.length > 0 && <DataTableTemplate
                                title={'Trustline changes'}
                                tableStatus={tableStatus}
                                headers={changeTrustHeaders}
                                rows={changeTrustRows}
                            />}
                            {allowTrustRows.length > 0 && <DataTableTemplate
                                title={'Trustline authorizations'}
                                tableStatus={tableStatus}
                                headers={allowTrustHeaders}
                                rows={allowTrustRows}
                            />}
                        </div>
                    )
                }}
            </Query>
        )
    }
}
export default TrustHistory;
