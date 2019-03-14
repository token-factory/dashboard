import React, { Component } from 'react';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import { ADD_SIGNER, GET_ACCOUNT } from '../../queries/account';
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
        field: 'signer',
        method: 'isEmpty',
        validWhen: false,
        message: 'Signer is required'
    },
    {
        field: 'weight',
        method: 'isInt',
        args: [{ min: 0, max: 255 }],
        validWhen: true,
        message: 'Weight must be an integer between 0 and 255'
    }
]);

const initialState = {
    publicKey: '',
    signer: '',
    weight: '',
    passphrase: '',
    submitted: false,
    validation: validator.valid()
};
class AddSigner extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey
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
    async handleSubmit() {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { publicKey, signer, weight, passphrase } = this.state;
        try {
            this.startLoading();
            const addSignerVariables = {
                publicKey: publicKey,
                signer: signer,
                weight: parseInt(weight, 10)
            };
            const refetchQueries = [
                {
                    query: GET_ACCOUNT,
                    variables: { publicKey: publicKey }
                }
            ];
            //Add Signer Transaction
            const addSignerResponse = await apolloMutation(
                ADD_SIGNER,
                addSignerVariables
            );
            const transactionId = addSignerResponse.data.createSignerTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(publicKey, transactionId, passphrase, refetchQueries);
            this.stopLoading();
            this.props.handleCloseAddNew();
        } catch (error) {
            this.stopLoading();
        }
    }
    handleCloseAddNew() {
        this.props.handleCloseAddNew();
    }
    render() {
        const { loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const addSignerModal = (
            <Modal
                id="addSigner-modal"
                shouldSubmitOnEnter={true}
                modalHeading="Add signer"
                open={true}
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Create"
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={() => this.handleCloseAddNew()}
                onRequestClose={() => this.handleCloseAddNew()}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                {/* Signer */}
                <TextInput
                    id="signer"
                    name="signer"
                    type="text"
                    placeholder="Signer public key"
                    labelText="Signer public key"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.signer.isInvalid}
                    invalidText={formValidation.signer.message}
                />
                {/* Weight  */}
                <TextInput
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="Weight"
                    labelText="Weight"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.weight.isInvalid}
                    invalidText={formValidation.weight.message}
                />

                {/* passphrase  */}
                <PassphraseInput
                    id="addSignerPassword"
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
                {addSignerModal}
            </div>
        );
    }
}

export default AddSigner;
