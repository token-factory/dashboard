import React, { Component } from 'react';
import PassphraseInput from '../utils/PassphraseInput'; import { Loading, Modal } from 'carbon-components-react';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import { DELETE_OFFER, GET_OFFERS } from '../../queries/account';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
]);
const initialState = {
    passphrase: '',
    showModal: '',
    submitted: false,
    validation: validator.valid()
};
class DeleteOffer extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentWillMount() {
        this.setState({
            passphrase: ''
        });
    }
    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    startLoading() {
        this.setState({ showModal: 'processing' });
    }

    stopLoading() {
        this.setState({ showModal: '' });
    }

    async handleSubmit(event) {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { parentState } = this.props;
        event.preventDefault();
        try {
            this.startLoading();
            const deleteOfferVariables = {
                publicKey: parentState.publicKey,
                offerId: parentState.offerData.offerid,
                sellAssetCode: parentState.offerData.sellingassetcode ? parentState.offerData.sellingassetcode : 'XLM',
                sellAssetIssuer: parentState.offerData.sellingissuer ? parentState.offerData.sellingissuer : '',
                buyAssetCode: parentState.offerData.buyingassetcode ? parentState.offerData.buyingassetcode : 'XLM',
                buyAssetIssuer: parentState.offerData.buyingissuer ? parentState.offerData.buyingissuer : ''
            };
            const refetchQueries = [
                {
                    query: GET_OFFERS,
                    variables: { publicKey: parentState.publicKey }
                }
            ];
            //Delete Offer Transaction
            const deleteOfferResponse = await apolloMutation(
                DELETE_OFFER,
                deleteOfferVariables
            );
            const transactionId = deleteOfferResponse.data.deleteOffer.id;
            //Sign Transaction
            await apolloSignTransaction(parentState.publicKey, transactionId, this.state.passphrase, refetchQueries);

            this.stopLoading();
            this.props.handleCloseDeleteOfferModal();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Delete offer network error : ', err);
            this.stopLoading();
            this.props.handleCloseDeleteOfferModal();
        }
    }
    render() {
        const { validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const offerType = this.props.parentState.param ? this.props.parentState.param.offerType : '';
        const prefixId = this.constructor.name + offerType;
        const offerConfirmContent = (
            <Modal
                id="delete-offer-modal"
                open={this.props.parentState.showDeleteOfferModal}
                danger={true}
                shouldSubmitOnEnter={false}
                modalHeading="Enter your passphrase to delete this offer"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onSecondarySubmit={this.props.handleCloseDeleteOfferModal}
                onRequestClose={this.props.handleCloseDeleteOfferModal}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {this.state.showModal === 'processing' ? <Loading /> : null}
                {/* passphrase  */}
                <PassphraseInput
                    id={`${prefixId}deleteOfferPassphrase`}
                    placeholderText="Your passphrase"
                    name="passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
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

export default DeleteOffer;
