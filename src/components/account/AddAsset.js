import React, { Component } from 'react';
import { CREATE_ASSET, GET_ASSETS } from '../../queries/account';
import FeeAgreement, { ISSUE_FEES } from '../utils/FeeAgreement';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import { apolloMutation, handleError } from '../../libs/apollo';
import FormValidator from '../utils/FormValidator';
import { duplicateAssetCheck } from '../../libs/libs';

import '../../style/scss/forms.scss';

const assetExisted = (assetCode, state) => {
    return duplicateAssetCheck(assetCode, state.assetIssuer, state.data);
}
const validator = new FormValidator([
    {
        field: 'assetCode',
        method: 'isEmpty',
        validWhen: false,
        message: 'Asset code is required'
    },
    {
        field: 'assetCode',
        method: assetExisted,
        validWhen: false,
        message: 'This asset already exists'
    },
    {
        field: 'description',
        method: 'isEmpty',
        validWhen: false,
        message: 'Description is required'
    }
]);

const initialState = {
    assetCode: '',
    description: '',
    feeAgreed: false,
    submitted: false,
    validation: validator.valid()
};

class AddAsset extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount() {
        this.setState({
            assetIssuer: this.props.parentState.publicKey,
            data: this.props.data,
            assetCode: '',
            description: ''
        });
    }
    async handleSubmit() {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        if (!this.state.feeAgreed) {
            return;
        }
        try {
            this.startLoading();
            const refetchQuery = [
                {
                    query: GET_ASSETS,
                    variables: {}
                }
            ];
            //Create Asset Transaction
            const { assetCode, assetIssuer, description } = this.state;
            const variables = {
                assetCode, assetIssuer, description
            }
            await apolloMutation(CREATE_ASSET, variables, refetchQuery);
            this.stopLoading();
            this.props.handleCloseAddNew();
        } catch (error) {
            await handleError(
                error,
                'Create asset network error',
                error.message
            );
            this.stopLoading();
        }
    }

    startLoading() {
        this.setState({ loading: true });
    }
    stopLoading() {
        this.setState({ loading: false });
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onCheckboxChange(value) {
        this.setState({
            feeAgreed: value
        });
    }
    handleCloseAddNew() {
        this.props.handleCloseAddNew();
    }
    render() {
        const { validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const prefixId = this.constructor.name;
        const addAssetModal = (
            <Modal
                id="addAsset-modal"
                shouldSubmitOnEnter={true}
                open={true}
                modalHeading="Create asset"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Create"
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={() => this.handleCloseAddNew()}
                onRequestClose={() => this.handleCloseAddNew()}
                onRequestSubmit={event => this.handleSubmit(event)}
                primaryButtonDisabled={!this.state.feeAgreed}
            >
                {this.state.loading ? <Loading /> : null}
                {/* Asset Code  */}
                <TextInput
                    id="assetCode"
                    name="assetCode"
                    labelText="Asset code"
                    type="text"
                    placeholder="Asset code"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.assetCode.isInvalid}
                    invalidText={formValidation.assetCode.message}
                />
                {/* Asset Description  */}
                <TextInput
                    id="description"
                    name="description"
                    labelText="Asset description"
                    type="text"
                    placeholder="Asset description"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.description.isInvalid}
                    invalidText={formValidation.description.message}
                />
                {/* Transaction Fees */}
                <FeeAgreement
                    controlId={`${prefixId}feeAgreement`}
                    feeType={ISSUE_FEES}
                    onCheckboxChange={(value, id) =>
                        this.onCheckboxChange(value, id)
                    }
                />
            </Modal>
        );
        return (
            <div>
                {addAssetModal}
            </div>
        );
    }
}

export default AddAsset;
