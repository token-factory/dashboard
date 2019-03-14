import React, { Component, Fragment } from 'react';
import WaitingAssets from './WaitingAssets';
import NoRecords from '../utils/NoRecords';
import { apolloClient } from '../../apolloclient/apolloClient';
import { REQUEST_STATUS, STROOP_FACTOR } from '../../libs/constants';
import { GET_WAITING_ASSETS } from '../../queries/account';

class MyIssuingAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: this.props.parentState.publicKey,
            approveComponentData: [],
            revokeComponentData: [],
            processStatus: ''
        }
    }
    async componentDidMount() {
        this.refreshData();
    }
    async fetchData() {
        const variables = {
            issuer: this.state.publicKey
        };

        try {
            this.setState({
                processStatus: REQUEST_STATUS.LOADING
            });
            const response = await apolloClient.query({
                query: GET_WAITING_ASSETS,
                variables: variables
            });
            const trustLines = await response.data.allTrustlines;
            this.setState({
                processStatus: REQUEST_STATUS.SUCCESS
            });
            return trustLines;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error here: ', err);
            this.setState({
                processStatus: REQUEST_STATUS.ERROR
            });
        }
    }
    getDataRows(trustLineNodes) {
        const approveComponentData = [];
        const revokeComponentData = [];
        trustLineNodes.forEach(trustData => {
            const action = [
                {
                    onClick: this.trustActionClick,
                    itemText: trustData.flags === 0 ? 'Approve' : 'Revoke',
                    payload: trustData,
                    id: 'trust-action-id'
                }
            ];

            const item = {
                id: trustData.id,
                assetcode: {
                    type: 'string',
                    value: trustData.assetcode
                },
                trustor: {
                    type: 'string',
                    value: trustData.accountid,
                    truncate: true
                },
                trustAmount: {
                    type: 'string',
                    value: trustData.tlimit * STROOP_FACTOR
                },
                action: { type: 'action', value: action }
            };
            if (trustData.flags === 0) {
                approveComponentData.push(item);
            } else {
                revokeComponentData.push(item);
            }
        });

        this.setState({
            approveComponentData,
            revokeComponentData
        })
    }
    async handleDataChange() {
        this.refreshData();
    }
    async refreshData() {
        const trustLines = await this.fetchData();
        if (trustLines && trustLines.nodes) {
            this.getDataRows(trustLines.nodes);
        }
    }
    render() {
        const { approveComponentData, revokeComponentData, processStatus } = this.state;

        if (processStatus === REQUEST_STATUS.SUCCESS && approveComponentData.length === 0 && revokeComponentData.length === 0) {
            return <NoRecords title="Assets" detail="You do not have any assets." />
        }
        let approveContent = null;
        if (approveComponentData.length > 0) {
            approveContent = <WaitingAssets
                dataRows={approveComponentData}
                parentState={this.props.parentState}
                title='Awaiting approval'
                trustlineModalTitle='Trustline approval'
                submitLabel='Submit'
                authorizeTrust={true}
                handleDataChange={() => this.handleDataChange()}
                tableStatus={processStatus}
            />
        }
        let revokeContent = null;
        if (revokeComponentData.length > 0) {
            revokeContent = <WaitingAssets
                dataRows={revokeComponentData}
                parentState={this.props.parentState}
                title='Recent activity'
                trustlineModalTitle='Trustline revoke'
                submitLabel='Revoke'
                authorizeTrust={false}
                handleDataChange={() => this.handleDataChange()}
                tableStatus={processStatus}
            />
        }
        return (
            <Fragment>
                {approveContent}
                {revokeContent}
            </Fragment>
        )
    }
}
export default MyIssuingAssets;
