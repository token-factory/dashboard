import React, { Component } from 'react';
import { Modal, Loading } from 'carbon-components-react';
import { DELETE_SIGNER, GET_ACCOUNT } from '../../queries/account';
import PassphraseInput from '../utils/PassphraseInput';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss'

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
]);
const initialState = {
    publicKey: '',
    signerPublicKey: '',
    passphrase: '',
    weight: 0,
    loading: false,
    submitted: false,
    validation: validator.valid()
};
class DeleteSigner extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey,
            signer: this.props.parentState.payload.signerPublicKey
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
        const { publicKey, signer, passphrase } = this.state;
        event.preventDefault();
        try {
            this.startLoading();
            const deleteSignerVariables = {
                publicKey, signer, weight: 0 //TODO: need to move this to the backend
            };
            const refetchQueries = [
                {
                    query: GET_ACCOUNT,
                    variables: { publicKey: publicKey }
                }
            ];
            //Delete Sigenr Transaction
            const deleteSignerResponse = await apolloMutation(
                DELETE_SIGNER,
                deleteSignerVariables
            );
            const transactionId = deleteSignerResponse.data.createSignerTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(publicKey, transactionId, passphrase, refetchQueries);
            this.stopLoading();
            this.props.handleModalClose();
        } catch (error) {
            this.stopLoading();
            this.props.handleModalClose();
        }
    }

    render() {
        const { validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const deleteSignerModal = (
            <Modal
                id="delete-signer-modal"
                open={true}
                danger={true}
                shouldSubmitOnEnter={false}
                modalHeading="Delete signer"
                modalAriaLabel=""
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onSecondarySubmit={this.props.handleModalClose}
                onRequestClose={this.props.handleModalClose}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {this.state.loading ? <Loading /> : null}
                {/* passphrase  */}
                <PassphraseInput
                    id="deleteSignerPassword"
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
                {deleteSignerModal}
            </div>
        );
    }
}

export default DeleteSigner;
