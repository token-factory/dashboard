import React, { Component, Fragment } from 'react';
import {
    Checkbox,
    CheckboxSkeleton,
    Modal,
    Loading,
    InlineNotification
} from 'carbon-components-react';
import { SET_FLAG, GET_ACCOUNT } from '../../queries/account';
import PassphraseInput from '../utils/PassphraseInput';
import { handleError, apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/account-authorization.scss';
import '../../style/scss/forms.scss';

const SET_FLAGS = 'setFlags';
const CLEAR_FLAGS = 'clearFlags';
const AUTHORIZATION_REQUIRED = 'AuthRequiredFlag';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    }
]);

const initialState = {
    modalStatus: false,
    passphrase: '',
    loading: false,
    submitted: false,
    validation: validator.valid()
};

class AccountAuthorization extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    onCheckboxChange(value) {
        this.setState({
            authRequired: value,
            modalStatus: true,
            passphrase: ''
        });
    }

    closeModal() {
        this.setState(initialState);
    }

    async handleSubmit(event) {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { authRequired, passphrase } = this.state;
        const { parentState } = this.props;
        event.preventDefault();
        try {
            const refetchQueries = [{
                query: GET_ACCOUNT,
                variables: { publicKey: parentState.publicKey }
            }];
            const variables = {
                publicKey: parentState.publicKey,
                flagOperations: authRequired ? SET_FLAGS : CLEAR_FLAGS,
                flagToSet: AUTHORIZATION_REQUIRED
            };
            this.handleLoading(true);
            //Authorization Transaction
            const setAuthorizationResponse = await apolloMutation(
                SET_FLAG,
                variables
            );
            const transactionId = setAuthorizationResponse.data.createFlagTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(
                parentState.publicKey,
                transactionId,
                passphrase,
                refetchQueries
            );
            this.handleLoading(false);
            this.setState(initialState);
        } catch (error) {
            await handleError(
                error,
                'Account authorization error',
                error.message
            );
            this.setState(initialState);
            this.handleLoading(false);
        }
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoading(loading) {
        this.setState({ loading })
    }

    render() {
        const { data } = this.props;
        const { loading, passphrase, modalStatus, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        return (
            <div className="account-authorization">
                <h4>Authorization</h4>
                {data.loading && <CheckboxSkeleton />}
                {data.error
                    && <InlineNotification
                        kind="error"
                        title=""
                        subtitle="There was an error loading your authorization settings." />}
                {data.getAccount
                    && <Fragment>
                        <Checkbox
                            id={'auth-checkbox'}
                            checked={data.getAccount.flags.auth_required}
                            labelText={'Require authorization before other accounts can hold credit.'}
                            onChange={value => this.onCheckboxChange(value)} />
                        <Modal
                            id="authorization-modal"
                            open={modalStatus}
                            shouldSubmitOnEnter
                            danger={true}
                            modalHeading={`${data.getAccount.flags.auth_required ? 'Revoke' : 'Require'} trustline authorization`}
                            primaryButtonText="Submit"
                            secondaryButtonText="Close"
                            onSecondarySubmit={() => this.closeModal()}
                            onRequestClose={() => this.closeModal()}
                            onRequestSubmit={event => this.handleSubmit(event)}>
                            {loading && <Loading />}
                            <p>{`Are you sure you want to ${data.getAccount.flags.auth_required ? 'revoke' : 'require'} authorization for this account?`}</p>
                            <p>To continue, enter your passphrase.</p>
                            <PassphraseInput
                                id="auth-flag-passphrase"
                                placeholderText="Your passphrase"
                                name="passphrase"
                                labelText="Passphrase"
                                onChange={event => this.onInputChange(event)}
                                otherTextInputProps={{ value: passphrase }}
                                invalid={formValidation.passphrase.isInvalid}
                                invalidText={formValidation.passphrase.message}
                            />
                        </Modal>
                    </Fragment>}
            </div>
        );
    }
}

export default AccountAuthorization;
