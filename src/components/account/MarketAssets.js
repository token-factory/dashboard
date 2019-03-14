import React, { Component } from 'react';
import { GET_ASSETS } from '../../queries/account';
import AddAsset from './AddAsset';
import TrustAsset from './TrustAsset';
import DataTableTemplate from '../utils/DataTableTemplate';
import { Query } from 'react-apollo';
import NoRecords from '../utils/NoRecords';
import { Button } from 'carbon-components-react';
import { POLL_INTERVAL, REQUEST_STATUS } from '../../libs/constants'

class MarketAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus: '',
            allAsset: true,
            myAsset: false,
            assetCode: '',
            assetIssuer: '',
            showAddNew: false
        };

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
        this.trustAsset = this.trustAsset.bind(this);
    }

    getHeaders() {
        const headers = [
            { key: 'asset_code', header: 'Asset Code' },
            { key: 'description', header: 'Description' },
            { key: 'asset_issuer', header: 'Asset Issuer' },
            { key: 'action', header: '' }
        ];
        return headers;
    }
    getRows(data) {
        const { parentState } = this.props;
        let rowId = 0;

        const assetRows = data.getAssets.map(
            ({ asset_code, description, asset_issuer }) => {
                const action = [
                    {
                        id: 'trust-asset-action',
                        className: 'trust-asset',
                        onClick: this.trustAsset,
                        itemText: 'Trust asset',
                        disabled: parentState.publicKey === asset_issuer, // user should not be able to trust self-issued assets
                        payload: {
                            assetCode: asset_code,
                            assetIssuer: asset_issuer
                        }
                    }
                ];

                return {
                    id: (rowId++).toString(),
                    asset_code: { type: 'string', value: asset_code },
                    description: { type: 'string', value: description },
                    asset_issuer: { type: 'string', value: asset_issuer, truncate: true },
                    action: { type: 'action', value: action }
                };
            }
        );

        return assetRows;
    }

    trustAsset(payload) {
        this.setState({
            modalStatus: 'trustAsset',
            assetCode: payload.assetCode,
            assetIssuer: payload.assetIssuer
        });
    }

    handleCloseTrustAsset() {
        this.setState({
            modalStatus: '',
            assetCode: '',
            assetIssuer: ''
        });
    }

    handleModalState(modalState) {
        this.setState({
            showAddNew: modalState
        });
    }
    render() {
        const { parentState } = this.props;
        return (
            <Query query={GET_ASSETS} pollInterval={POLL_INTERVAL}>
                {({ loading, error, data }) => {
                    let tableStatus;
                    let headers = [];
                    let rows = [];

                    if (loading) tableStatus = REQUEST_STATUS.LOADING;
                    else if (error) tableStatus = REQUEST_STATUS.ERROR;
                    else {
                        tableStatus = REQUEST_STATUS.SUCCESS;
                        headers = this.getHeaders();
                        rows = this.getRows(data);
                    }
                    const addNewComponent = (
                        <AddAsset
                            parentState={{ ...this.state, publicKey: parentState.publicKey }}
                            data={data}
                            handleCloseAddNew={() => this.handleModalState(false)}
                        />
                    );

                    const noRecordsComponent = (
                        <NoRecords
                            title="Assets"
                            detail="There are no market assets"
                        >
                            <Button onClick={() => this.handleModalState(true)}>
                                Create Asset
                            </Button>
                            {this.state.showAddNew && addNewComponent}
                        </NoRecords>
                    );

                    const dataTableComponent = (
                        <DataTableTemplate
                            title={'Market assets'}
                            tableStatus={tableStatus}
                            addNewComponent={addNewComponent}
                            addNewButtonText="Create asset"
                            addNewModalShow={this.state.showAddNew}
                            addNewClick={() => this.handleModalState(true)}
                            headers={headers}
                            rows={rows}
                        />
                    );
                    if (rows.length === 0 && (tableStatus === REQUEST_STATUS.SUCCESS)) {
                        return noRecordsComponent;
                    }
                    return (
                        <div>
                            {dataTableComponent}
                            {this.state.modalStatus === 'trustAsset' ? (
                                <TrustAsset
                                    parentState={{ ...this.state, publicKey: parentState.publicKey }}
                                    handleCloseTrustAsset={() =>
                                        this.handleCloseTrustAsset()
                                    }
                                />
                            ) : null}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default MarketAssets;
