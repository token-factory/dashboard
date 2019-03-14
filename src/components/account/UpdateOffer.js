import React, { Component } from 'react';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import {
    apolloMutation,
    handleSuccess,
    apolloSignTransaction
} from '../../libs/apollo';
import PassphraseInput from '../utils/PassphraseInput';
import { UPDATE_OFFER, GET_OFFERS } from '../../queries/account';
import PublicKey from './PublicKey';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'buyingassetcode',
        method: 'isEmpty',
        validWhen: false,
        message: 'Buying asset code is required'
    },
    {
        field: 'buyingamount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Buying amount is required'
    },
    {
        field: 'buyingissuer',
        method: 'isEmpty',
        validWhen: false,
        message: 'Buying issuer is required'
    },
    {
        field: 'sellingassetcode',
        method: 'isEmpty',
        validWhen: false,
        message: 'Selling asset code is required'
    },
    {
        field: 'sellingamount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Selling amount is required'
    },
    {
        field: 'sellingissuer',
        method: 'isEmpty',
        validWhen: false,
        message: 'Selling issuer is required'
    },
]);

const initialState = {
    buyingassetcode: '',
    buyingissuer: '',
    buyingamount: '',
    sellingassetcode: '',
    sellingissuer: '',
    sellingamount: '',
    passphrase: '',
    submitted: false,
    validation: validator.valid()
};
class UpdateOffer extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentWillMount() {
        const offerData = this.props.parentState.offerData
            ? this.props.parentState.offerData
            : {};
        this.setState({
            buyingassetcode: offerData.buyingassetcode
                ? offerData.buyingassetcode
                : 'XLM',
            buyingissuer: offerData.buyingissuer ? offerData.buyingissuer : ' ',
            buyingamount:
                offerData.amount && offerData.price
                    ? (offerData.amount * offerData.price).toString()
                    : '0',
            sellingassetcode: offerData.sellingassetcode
                ? offerData.sellingassetcode
                : 'XLM',
            sellingissuer: offerData.sellingissuer
                ? offerData.sellingissuer
                : ' ',
            sellingamount: offerData.amount ? offerData.amount : '0',
            passphrase: ''
        });
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

    async handleSubmit(event) {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }

        const { sellingassetcode, sellingissuer, sellingamount, buyingassetcode, buyingissuer, buyingamount, passphrase } = this.state;
        event.preventDefault();
        try {
            this.startLoading();

            const updateOfferVariables = {
                publicKey: this.props.parentState.publicKey,
                offerId: this.props.parentState.offerData.offerid,
                sellAssetCode: sellingassetcode ? sellingassetcode : 'XLM',
                sellAssetIssuer: sellingissuer ? sellingissuer : '',
                sellAmount: sellingamount,
                buyAssetCode: buyingassetcode ? buyingassetcode : 'XLM',
                buyAssetIssuer: buyingissuer ? buyingissuer : '',
                buyAmount: buyingamount
            };
            const refetchQueries = [
                {
                    query: GET_OFFERS,
                    variables: { publicKey: this.props.parentState.publicKey }
                }
            ];
            //Update Offer Transaction
            const updateOfferResponse = await apolloMutation(
                UPDATE_OFFER,
                updateOfferVariables
            );
            const transactionId = updateOfferResponse.data.updateOffer.id;
            //Sign Transaction
            await apolloSignTransaction(this.props.parentState.publicKey, transactionId, passphrase, refetchQueries);
            await handleSuccess(
                'Success!',
                'The offer was updated.'
            );
            this.stopLoading();
            this.props.handleCloseUpdateOfferModal();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error while updating offer here: ', err);
            this.stopLoading();
            this.props.handleCloseUpdateOfferModal();
        }
    }

    render() {
        const { validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const offerType = this.props.parentState.param ? this.props.parentState.param.offerType : '';
        const prefixId = this.constructor.name + offerType;
        const {
            sellingassetcode,
            sellingissuer,
            sellingamount,
            buyingassetcode,
            buyingissuer,
            buyingamount,
            loading
        } = this.state;
        return (
            <Modal
                id="transactionStatus-modal"
                open={this.props.parentState.showUpdateOfferModal}
                danger={false}
                shouldSubmitOnEnter={false}
                modalHeading="Update offer"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Save"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onSecondarySubmit={this.props.handleCloseUpdateOfferModal}
                onRequestClose={this.props.handleCloseUpdateOfferModal}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                <TextInput
                    id={`${prefixId}sellingassetcode`}
                    name="sellingassetcode"
                    placeholder="Sell asset code"
                    labelText="Sell asset code"
                    data-modal-primary-focus
                    onChange={event => this.onInputChange(event)}
                    value={sellingassetcode}
                    invalid={formValidation.sellingassetcode.isInvalid}
                    invalidText={formValidation.sellingassetcode.message}
                />
                <TextInput
                    id={`${prefixId}sellingissuer`}
                    name="sellingissuer"
                    placeholder="Sell asset issuer"
                    labelText="Sell asset issuer"
                    data-modal-primary-focus
                    onChange={event => this.onInputChange(event)}
                    value={sellingissuer}
                    invalid={formValidation.sellingissuer.isInvalid}
                    invalidText={formValidation.sellingissuer.message}
                />
                <TextInput
                    id={`${prefixId}sellingamount`}
                    name="sellingamount"
                    placeholder="Sell amount"
                    labelText="Sell amount"
                    type="number"
                    data-modal-primary-focus
                    onChange={event => this.onInputChange(event)}
                    value={sellingamount}
                    invalid={formValidation.sellingamount.isInvalid}
                    invalidText={formValidation.sellingamount.message}
                />
                <TextInput
                    id={`${prefixId}buyingassetcode`}
                    name="buyingassetcode"
                    placeholder="Buy asset code"
                    labelText="Buy asset code"
                    data-modal-primary-focus
                    onChange={event => this.onInputChange(event)}
                    value={buyingassetcode}
                    invalid={formValidation.buyingassetcode.isInvalid}
                    invalidText={formValidation.buyingassetcode.message}
                />
                <PublicKey publicKey={buyingissuer} label='Buy asset issuer' />
                <TextInput
                    id={`${prefixId}buyingamount`}
                    name="buyingamount"
                    placeholder="Buy amount"
                    labelText="Buy amount"
                    type="number"
                    data-modal-primary-focus
                    onChange={event => this.onInputChange(event)}
                    value={buyingamount}
                    invalid={formValidation.buyingamount.isInvalid}
                    invalidText={formValidation.buyingamount.message}
                />

                {/* passphrase  */}
                <PassphraseInput
                    id={`${prefixId}updateOfferPassphrase`}
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
export default UpdateOffer;
