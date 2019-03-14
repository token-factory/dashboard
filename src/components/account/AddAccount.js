import React, { Component } from 'react';
import { TextInput, Modal, Loading } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { CREATE_ACCOUNT, GET_ACCOUNTS } from '../../queries/account';
import { apolloMutation, handleError } from '../../libs/apollo';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const isDescriptionValid = (description) => {
    const descriptionRegex = /^[a-zA-Z0-9.\-_]{2,32}$/; // 2-32 in length, only allow alphanumeric characters, "_", "-" and "."
    return descriptionRegex.test(description);
}
const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'description',
        method: 'isEmpty',
        validWhen: false,
        message: 'Description is required'
    },
    {
        field: 'description',
        method: isDescriptionValid,
        validWhen: true,
        message: 'Description must be at least 2 characters, not exceed 32 characters, and contain only alphanumeric characters, \'-\', \'_\' and \'.\''
    },
]);

const initialState = {
    description: '',
    passphrase: '',
    loading: false,
    submitted: false,
    validation: validator.valid()
};

class AddAccount extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentDidMount() {
        this.setState({
            showModal: 'modalAccountCreation',
            publicKey: '',
            passphrase: ''
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
        try {
            const { description, passphrase, home_domain } = this.state;
            const { handleCloseAddNew } = this.props;
            this.startLoading();
            //Create Account Transaction
            await apolloMutation(
                CREATE_ACCOUNT,
                { description, passphrase, home_domain },
                [{ query: GET_ACCOUNTS }]
            );
            this.stopLoading();
            handleCloseAddNew();
        } catch (error) {
            await handleError(
                error,
                'Create account network error',
                error.message
            );
            this.stopLoading();
        }
    }
    onTriggerAddAccount(account) {
        this.props.triggerAddAccount(account);
    }

    handleCloseAddNew() {
        this.props.handleCloseAddNew();
    }
    render() {
        const { loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        return (
            <Modal
                id="addAccount-modal"
                shouldSubmitOnEnter={true}
                open={true}
                modalHeading="Create account"
                modalAriaLabel=""
                primaryButtonText="Create"
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={() => this.handleCloseAddNew()}
                onRequestClose={() => this.handleCloseAddNew()}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                <TextInput
                    id="description"
                    name="description"
                    placeholder="Description"
                    labelText="Description"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.description.isInvalid}
                    invalidText={formValidation.description.message}
                />
                <TextInput
                    id="home-domain"
                    name="home_domain"
                    placeholder="Optional home domain"
                    labelText="Home domain"
                    onChange={event => this.onInputChange(event)}
                />
                {/* passphrase  */}
                <PassphraseInput
                    id="createAccountPassphrase"
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

export default AddAccount;
