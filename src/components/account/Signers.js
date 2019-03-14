import React, { Component } from 'react';
import AddSigner from './AddSigner';
import DataTableTemplate from '../utils/DataTableTemplate';
import DeleteSigner from './DeleteSigner';

const initialState = {
    publicKey: '',
    payload: {},
    modalStatus: ''
};
class Signers extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.getRows = this.getRows.bind(this);
        this.deleteSigner = this.deleteSigner.bind(this);
    }

    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
        });
    }

    getHeaders() {
        const headers = [
            { key: 'signerPublicKey', header: 'Signer Public Key' },
            { key: 'weight', header: 'Weight' },
            { key: 'action', header: '' }
        ];

        return headers;
    }

    getRows(data) {
        let rowId = 0;
        const signerRows = data.getAccount.signers.map(
            ({ weight, key }) => {
                const action = [
                    {
                        id: 'delete-signer-action',
                        className: 'delete-signer-action',
                        onClick: this.deleteSigner,
                        itemText: 'Delete signer',
                        payload: {
                            publicKey: this.state.publicKey,
                            signerPublicKey: key
                        }
                    }
                ];
                return {
                    id: (rowId++).toString(),
                    signerPublicKey: { type: 'string', value: key, truncate: true },
                    weight: { type: 'string', value: weight },
                    action: { type: 'action', value: action }
                };
            }
        );
        return signerRows;
    }

    handleModalClose() {
        this.setState(initialState);
    }

    deleteSigner(payload) {
        this.setState({
            payload: payload,
            modalStatus: 'deleteSigner'
        });
    }
    handleModalState(modalState) {
        this.setState({
            showAddNew: modalState
        });
    }
    render() {
        let tableStatus = 'loading';
        let headers = [];
        let rows = [];

        if (this.props.data.loading) {
            tableStatus = 'loading';
        } else if (this.props.data.error) {
            tableStatus = 'error';
        } else {
            tableStatus = 'success';
            headers = this.getHeaders();
            rows = this.getRows(this.props.data);
        }

        const addNewComponent = (
            <AddSigner
                parentState={this.state}
                handleCloseAddNew={() => this.handleModalState(false)}
            />
        );
        const dataTableComponent = (
            <DataTableTemplate
                title={'Signers'}
                tableStatus={tableStatus}
                addNewComponent={addNewComponent}
                addNewButtonText="Add signer"
                addNewModalShow={this.state.showAddNew}
                addNewClick={() => this.handleModalState(true)}
                headers={headers}
                rows={rows}
            />
        );

        return (
            <div>
                {dataTableComponent}
                {this.state.modalStatus === 'deleteSigner' ? (
                    <DeleteSigner
                        parentState={this.state}
                        handleModalClose={() => this.handleModalClose()}
                    />
                ) : null}
            </div>
        );
    }
}

export default Signers;
