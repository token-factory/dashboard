import React, { Component, Fragment } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import TrustAction from './TrustAction';
import { STROOP_FACTOR } from '../../libs/constants';

class WaitingAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus: '',
            publicKey: this.props.parentState.publicKey,
            authorizeTrust: this.props.authorizeTrust,
            title: this.props.title,
            submitLabel: this.props.submitLabel,
            trustlineModalTitle: this.props.trustlineModalTitle,
            tableStatus: this.props.tableStatus,
            headers: []
        };
    }
    async componentDidMount() {
        this.setState({
            headers: this.getHeaders(),
        });
    }
    assignClickAction(dataRows) {
        const dataRowsWithClick = dataRows.map(dataRow => {
            dataRow.action.value[0].onClick = this.trustActionClick;
            return dataRow;
        });
        return dataRowsWithClick;
    }
    handleSearchTextChange(e) {
        this.props.onSearchChange(e.target.value);
    }
    trustActionClick = (payload) => {
        this.setState({
            modalStatus: 'trustAction',
            trustData: payload
        });
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
    getHeaders() {
        let headers = [];
        headers = [
            {
                key: 'assetcode',
                header: 'Asset Code',
                type: 'string'
            },
            {
                key: 'trustor',
                header: 'Trustor',
                type: 'string'
            },
            {
                key: 'trustAmount',
                header: 'Trust Amount',
                type: 'string'
            },
            { key: 'action', header: '' }
        ];

        return headers;
    }
    handleCloseTrustAction(isClose) {
        this.setState({
            modalStatus: '',
            trustData: {}
        });

        if (!isClose) {
            this.props.handleDataChange();
        }
    }

    render() {
        const { headers, title, trustlineModalTitle, modalStatus, tableStatus, submitLabel } = this.state;
        const dataRows = this.props.dataRows;
        const rows = this.assignClickAction(dataRows);
        if (dataRows.length === 0) {
            return null;
        }

        return (
            <Fragment>
                <DataTableTemplate
                    headers={headers}
                    rows={rows}
                    title={title}
                    tableStatus={tableStatus}
                />
                {modalStatus === 'trustAction' ? (
                    <TrustAction
                        title={trustlineModalTitle}
                        submitLabel={submitLabel}
                        parentState={this.state}
                        handleCloseTrustAction={isClose => this.handleCloseTrustAction(isClose)}
                    />
                ) : null}
            </Fragment>
        );
    }
}
export default WaitingAssets;
