import React, { Component } from 'react';
import DataTableTemplate from '../utils/DataTableTemplate';
import SetWeight from './SetWeight';

class AccountOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getRows = this.getRows.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
    }

    componentDidMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
        });
    }

    getHeaders() {
        const headers = [
            { key: 'master_weight', header: 'Master Weight' },
            { key: 'low_threshold', header: 'Low Threshold' },
            { key: 'med_threshold', header: 'Med Threshold' },
            { key: 'high_threshold', header: 'High Threshold' }
        ];
        return headers;
    }

    getRows(data) {
        let rowId = 0;
        const weightRows = [
            {
                id: (rowId++).toString(),
                master_weight: {
                    type: 'string',
                    value: data.getAccount.thresholds.master_weight
                },
                low_threshold: {
                    type: 'string',
                    value: data.getAccount.thresholds.low_threshold
                },
                med_threshold: {
                    type: 'string',
                    value: data.getAccount.thresholds.med_threshold
                },
                high_threshold: {
                    type: 'string',
                    value: data.getAccount.thresholds.high_threshold
                }
            }
        ];

        return weightRows;
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
            <SetWeight
                data={this.props.data}
                parentState={this.state}
                handleCloseAddNew={() => this.handleModalState(false)}
            />
        );
        const dataTableComponent = (
            <DataTableTemplate
                title={'Options'}
                tableStatus={tableStatus}
                addNewComponent={addNewComponent}
                addNewButtonText="Set options"
                addNewModalShow={this.state.showAddNew}
                addNewClick={() => this.handleModalState(true)}
                headers={headers}
                rows={rows}
            />
        );
        return <div>{dataTableComponent}</div>;
    }
}

export default AccountOptions;
