import React, { Component } from 'react';
import { CREATE_OFFER } from '../../queries/account';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import FeeAgreement, { OFFER_FEES } from '../utils/FeeAgreement';

import { apolloSignTransaction, apolloMutation } from '../../libs/apollo';
import PassphraseInput from '../utils/PassphraseInput';

import '../../style/scss/forms.scss'
import { ORDERBOOK_CONFIG, STROOP_FACTOR } from '../../libs/constants';
import FormValidator from '../utils/FormValidator';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'amount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Amount is required'
    },
    {
        field: 'amount',
        method: 'isFloat',
        args: [{ min: STROOP_FACTOR }],
        validWhen: true,
        message: 'Amount must be greater than 0'
    },
]);

const initialState = {
    publicKey: undefined,
    sellAssetCode: '',
    sellAssetIssuer: '',
    buyAssetCode: '',
    buyAssetIssuer: '',
    price: 0,
    amount: 0,
    offer: undefined,
    passphrase: '',

    loading: false,
    feeAgreed: false,

    submitted: false,
    validation: validator.valid()
};
class MatchOffer extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoading(loading) {
        this.setState({ loading })
    }

    componentWillMount() {
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, price, amount, offer } = this.props.payload;
        const { publicKey } = this.props;
        this.setState({
            publicKey, sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, price, amount, offer,
        })
    }

    closeModal() {
        this.setState(initialState);
        this.props.handleCloseMatchOfferModal();
    }

    async handleSubmit(event) {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        event.preventDefault();
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, price, offer } = this.props.payload;
        const { publicKey, amount, passphrase } = this.state;
        try {
            this.handleLoading(true);
            let sellAmount = 0;
            let buyAmount = 0;
            if (offer === ORDERBOOK_CONFIG.BIDS) {
                sellAmount = amount;
                buyAmount = amount * price;
            } else {
                buyAmount = amount;
                sellAmount = amount / price;
            }
            const variables = {
                publicKey, sellAssetCode, sellAssetIssuer, sellAmount, buyAssetCode, buyAssetIssuer, buyAmount
            };
            const matchOfferResponse = await apolloMutation(CREATE_OFFER, variables);
            const transactionId = matchOfferResponse.data.createOffer.id;
            await apolloSignTransaction(
                publicKey,
                transactionId,
                passphrase
            );
            this.handleLoading(false);
            this.closeModal();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error while matching offer here: ', err);
            this.handleLoading(false);
            this.closeModal();
        }
    }
    onCheckboxChange(value) {
        this.setState({
            feeAgreed: value
        });
    }

    render() {
        const { sellAssetCode, sellAssetIssuer, buyAssetCode, buyAssetIssuer, price, amount, loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const matchOfferContent = (
            <div>
                <TextInput
                    id='matchOffer-buyAssetCode'
                    name="buyAssetCode"
                    placeholder="Buy asset code"
                    labelText="Buy asset code"
                    data-modal-primary-focus
                    value={buyAssetCode}
                    disabled={true}
                />

                <TextInput
                    id='matchOffer-buyAssetIssuer'
                    name="buyAssetIssuer"
                    placeholder="Buy asset issuer"
                    labelText="Buy asset issuer"
                    data-modal-primary-focus
                    value={buyAssetIssuer}
                    disabled={true}
                />
                <TextInput
                    id='matchOffer-sellAssetcode'
                    name="sellAssetCode"
                    placeholder="Sell asset code"
                    labelText="Sell asset code"
                    data-modal-primary-focus
                    value={sellAssetCode}
                    disabled={true}
                />
                <TextInput
                    id='matchOffer-sellAssetIssuer'
                    name="sellAssetIssuer"
                    placeholder="Sell asset issuer"
                    labelText="Sell asset issuer"
                    data-modal-primary-focus
                    value={sellAssetIssuer}
                    disabled={true}
                />
                <TextInput
                    id='matchOffer-amount'
                    name="amount"
                    placeholder={'Amount'}
                    labelText={'Amount'}
                    data-modal-primary-focus
                    value={amount}
                    type="number"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.amount.isInvalid}
                    invalidText={formValidation.amount.message}
                />
                <TextInput
                    id='matchOffer-price'
                    name="price"
                    placeholder={'Price'}
                    labelText={'Price'}
                    data-modal-primary-focus
                    value={price}
                    type="number"
                    disabled={true}
                />
            </div>
        );
        const offerConfirmContent = (
            <Modal
                id="transaction-status-modal"
                open={true}
                danger={false}
                shouldSubmitOnEnter={false}
                modalHeading="Match offer"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Match"
                secondaryButtonText="Cancel"
                primaryButtonDisabled={!this.state.feeAgreed}
                iconDescription="Close"
                onSecondarySubmit={() => this.closeModal()}
                onRequestClose={() => this.closeModal()}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {matchOfferContent}
                {loading ? <Loading /> : null}

                <PassphraseInput
                    id='matchOffer-passphrase'
                    placeholderText="Your passphrase"
                    name="passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
                />

                {/* Fees */}
                <FeeAgreement
                    controlId='matchOffer-fee'
                    feeType={OFFER_FEES}
                    onCheckboxChange={(value, id) => this.onCheckboxChange(value, id)}
                />
            </Modal>
        );

        return (
            <div>
                {offerConfirmContent}
            </div>
        );
    }
}

export default MatchOffer;
