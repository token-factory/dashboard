import React, { Component } from 'react';
import {
    Form,
    TextInput,
    Button,
    Select,
    SelectItem
} from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { graphql } from 'react-apollo';
import { CREATE_USER, LOGIN_USER, LIST_TENANTS } from '../../queries/register';
import { Module, ModuleBody } from 'carbon-addons-cloud-react';
import '../../style/scss/module.scss';
import { apolloMutation, handleError, handleSuccess } from '../../libs/apollo';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            tenantId: '',
            password: '',
            confirmPassword: '',
        };
    }
    onInputChange(keyName, e) {
        this.setState({ [keyName]: e.target.value });
    }

    async handleSuccess(data) {
        localStorage.setItem('authToken', data.login.authToken);
        const successTitle = 'Success!';
        const successMessage = 'You have created a TokenFactory account.'
        handleSuccess(successTitle, successMessage, true);
        this.props.history.push('/accounts');
    }

    async submitForm(event) {
        const { password, confirmPassword, email, tenantId } = this.state;
        event.preventDefault();
        //UI input valid check
        if (password !== confirmPassword) {
            const errorTitle = 'Password mismatch';
            const errorMessage = 'Your password and confirmation password do not match.';
            handleError(null, errorTitle, errorMessage, true);
            return;
        }
        try {
            //signup
            const signupVariables = { email, password, tenantId }
            await apolloMutation(CREATE_USER, signupVariables);

            //login
            const loginVariables = { email, password }
            const loginResponse = await apolloMutation(LOGIN_USER, loginVariables);

            //successful
            this.handleSuccess(loginResponse.data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            handleError(error, 'Signup error', error.message, true);
        }
    }

    handleCancel() {
        const { history } = this.props;
        history.push('/login');
    }

    render() {
        const { LIST_TENANTS } = this.props;
        return (
            <div className="module-container">
                <h1>Join TokenFactory</h1>
                <Module size="single">
                    <ModuleBody>
                        <Form className="module-container__form" onSubmit={event => this.submitForm(event)}>
                            <TextInput
                                id="signup-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email address"
                                labelText="Email address"
                                required
                                onChange={event => this.onInputChange('email', event)}
                            />
                            <PassphraseInput
                                id="signup-password"
                                name="password"
                                placeholderText="Enter your password"
                                labelText="Password"
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.onInputChange('password', event)}
                            />
                            <PassphraseInput
                                id="signup-confirm-password"
                                name="password"
                                placeholderText="Confirm your password"
                                labelText="Confirm password"
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.onInputChange('confirmPassword', event)}
                            />
                            <Select
                                id="signup-tenant"
                                name="tenantId"
                                className="tenant-select"
                                defaultValue="No tenants available..."
                                labelText="Tenants"
                                required
                                onChange={event => this.onInputChange('tenantId', event)}
                            >
                                <SelectItem hidden value="" text="Choose a tenant" />
                                <SelectItem value="" text="None" />
                                {LIST_TENANTS.listTenants
                                    ? LIST_TENANTS.listTenants.map(
                                        ({ id, name }) => (
                                            <SelectItem
                                                key={id}
                                                value={name}
                                                text={name}
                                            />
                                        )
                                    )
                                    : null}
                            </Select>
                            <div className="module-container__buttons">
                                <Button kind="secondary" type="button" onClick={() => this.handleCancel()}>Cancel</Button>
                                <Button kind="primary" type="submit">Create account</Button>
                            </div>
                        </Form>
                    </ModuleBody>
                </Module>
            </div>
        );
    }
}
export default graphql(LIST_TENANTS, { name: 'LIST_TENANTS' })(Signup);
