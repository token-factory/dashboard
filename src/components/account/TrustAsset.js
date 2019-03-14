import React, { Component } from 'react';
import { TextInput, Modal, Loading } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { TRUST_ASSET } from '../../queries/account';
import { apolloMutation, apolloSignTransaction, handleSuccess } from '../../libs/apollo';
import PublicKey from './PublicKey';
import FormValidator from '../utils/FormValidator';
import { STROOP_FACTOR } from '../../libs/constants';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'limit',
        method: 'isEmpty',
        validWhen: false,
        message: 'Trust amount is required'
    },
    {
        field: 'limit',
        method: 'isFloat',
        args: [{ min: STROOP_FACTOR }],
        validWhen: true,
        message: 'Trust amount must be greater than 0'
    },
]);

const initialState = {
    trustorPublicKey: '',
    assetCode: '',
    assetIssuer: '',
    limit: '',
    passphrase: '',
    loading: false,
    submitted: false,
    validation: validator.valid()
};

class TrustAsset extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
    }

    componentWillMount() {
        this.setState({
            trustorPublicKey: this.props.parentState.publicKey,
            assetCode: this.props.parentState.assetCode,
            assetIssuer: this.props.parentState.assetIssuer
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
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { trustorPublicKey, assetCode, assetIssuer, passphrase, limit } = this.state;
        event.preventDefault();
        try {
            this.startLoading();
            const trustAssetVariables = { trustorPublicKey, assetCode, assetIssuer, limit };
            //Trust Asset Transaction
            const trustAssetResponse = await apolloMutation(
                TRUST_ASSET,
                trustAssetVariables
            );
            const transactionId = trustAssetResponse.data.createTrustTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(trustorPublicKey, transactionId, passphrase);
            await handleSuccess('Success!', 'New asset trusted');
            this.stopLoading();
            this.props.handleCloseTrustAsset();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this.stopLoading();
            this.props.handleCloseTrustAsset();
        }
    }

    render() {
        const { loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const { handleCloseTrustAsset, parentState } = this.props;
        return (
            <Modal
                id="trustAsset-modal"
                open={true}
                danger={false}
                shouldSubmitOnEnter={true}
                modalHeading="Trust asset"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Trust"
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={handleCloseTrustAsset}
                onRequestClose={handleCloseTrustAsset}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                {/* Trust Asset Code  */}
                <TextInput
                    id="trustAsset-assetCode"
                    name="assetCode"
                    type="text"
                    className="bx--text-input"
                    placeholder="Asset code"
                    labelText="Asset code"
                    value={parentState.assetCode}
                />
                {/* Trust Asset Issuer */}
                <PublicKey publicKey={parentState.assetIssuer} label='Asset issuer' />
                {/* Trust Limit  */}
                <TextInput
                    id="trustAsset-limit"
                    name="limit"
                    type="number"
                    className="bx--number-input"
                    placeholder="Amount of asset trusted"
                    labelText="Trust amount"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.limit.isInvalid}
                    invalidText={formValidation.limit.message}
                />
                {/* passphrase  */}
                <PassphraseInput
                    id="trustAssetPhassphrase"
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

export default TrustAsset;
