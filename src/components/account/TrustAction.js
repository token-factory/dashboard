import React, { Component } from 'react';
import {
    apolloMutation,
    apolloSignTransaction
} from '../../libs/apollo';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import gql from 'graphql-tag';
import PublicKey from './PublicKey';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    }
]);

const initialState = {
    trustor_public_key: '',
    asset_code: '',
    limitAmount: '',
    passphrase: '',
    loading: '',
    submitted: false,
    validation: validator.valid()
};

class TrustAction extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            asset_issuer: this.props.parentState.publicKey,
            asset_code: this.props.parentState.trustData.assetcode,
            trustor_public_key: this.props.parentState.trustData.accountid,
            limitAmount: this.props.parentState.trustData.tlimit,
            authorize_trust: this.props.parentState.authorizeTrust,
            title: this.props.title,
            submitLabel: this.props.submitLabel
        });
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    startLoading() {
        this.setState({ loading: true });
    }
    stopLoading() {
        this.setState({ loading: false });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        try {
            this.startLoading();

            const createTrustMutation = gql`
        mutation createAllowTrustTransaction(
          $asset_issuer: String!
          $asset_code: String!
          $trustor_public_key: String!
          $authorize_trust: Boolean!
        ) {
          createAllowTrustTransaction(
            asset_issuer: $asset_issuer
            asset_code: $asset_code
            trustor_public_key: $trustor_public_key
            authorize_trust: $authorize_trust
          ) {
            id
          }
        }
      `;
            const { asset_issuer, asset_code, trustor_public_key, authorize_trust } = this.state;
            const variables = { asset_issuer, asset_code, trustor_public_key, authorize_trust };
            //Create Transaction
            const createTrustResponse = await apolloMutation(
                createTrustMutation,
                variables
            );
            const transactionId = createTrustResponse.data.createAllowTrustTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(
                this.state.asset_issuer,
                transactionId,
                this.state.passphrase
            );
            this.stopLoading();
            this.props.handleCloseTrustAction();
        } catch (error) {
            this.stopLoading();
            this.props.handleCloseTrustAction();
        }
    }

    render() {
        const { handleCloseTrustAction } = this.props;
        const { asset_code, limitAmount, trustor_public_key, loading, title, submitLabel, authorize_trust, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        return (
            <Modal
                id="trustAsset-modal"
                open={true}
                danger={!authorize_trust}
                shouldSubmitOnEnter={true}
                modalHeading={title}
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText={submitLabel}
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={handleCloseTrustAction}
                onRequestClose={handleCloseTrustAction}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                {/* Trustor  */}
                <PublicKey publicKey={trustor_public_key} label='Trustor' />
                {/* Asset Code  */}
                <TextInput
                    id="asset_code"
                    name="asset_code"
                    labelText="Asset code"
                    type="text"
                    placeholder="Asset code"
                    value={asset_code}
                    disabled={true}
                />
                {/* limit Amount */}
                <TextInput
                    id="limitAmount"
                    name="limitAmount"
                    labelText="Limit amount"
                    type="number"
                    value={limitAmount}
                    placeholder="Limit amount"
                    disabled={true}
                />
                {/* passphrase  */}
                <PassphraseInput
                    id="trustlineApprovePassphrase"
                    placeholderText="Your passphrase"
                    name="passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
                />
            </Modal>
        );
    }
}

export default TrustAction;
