import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apolloMutation, handleError, handleReset } from '../../libs/apollo';
import { Form, TextInput, Button } from 'carbon-components-react';
import { Module, ModuleBody } from 'carbon-addons-cloud-react';
import PassphraseInput from '../utils/PassphraseInput';
import { LOGIN_USER } from '../../queries/register';

import '../../style/scss/module.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: undefined
        };
    }

    async handleSuccess(data) {
        const { history } = this.props;
        localStorage.setItem('authToken', data.login.authToken);
        history.push('/accounts');
    }

    async submitForm(event) {
        const { email, password, error } = this.state;
        event.preventDefault();
        if (error) { // If existing error, reset toast notification
            handleReset();
            this.setState({ error: undefined });
        }
        try {
            const variables = {
                email,
                password
            }
            const loginResponse = await apolloMutation(LOGIN_USER, variables);
            this.handleSuccess(loginResponse.data);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this.setState({ error });
            handleError(error, 'Login error', error.message, true);
        }
    }

    render() {
        return (
            <div className="module-container">
                <h1>Sign in to TokenFactory</h1>
                <Module size="single">
                    <ModuleBody>
                        <Form className='module-container__form' onSubmit={event => this.submitForm(event)}>
                            <TextInput
                                id="login-email"
                                type="email"
                                placeholder="Enter your email address"
                                labelText="Email address"
                                required={true}
                                name="email"
                                autoComplete="email"
                                onChange={event =>
                                    this.setState({ email: event.target.value })
                                }
                            />
                            <PassphraseInput
                                id="login-password"
                                placeholderText="Enter your password"
                                labelText="Password"
                                name="password"
                                enableAutoComplete={true}
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.setState({ password: event.target.value })}
                            />
                            <Button className="bx--btn--full-width" kind="primary" type="submit">Sign in</Button>
                        </Form>
                        <div className="module-container__actions">
                            <p><Link to="/resetPassword">Forgot password?</Link></p>
                            <p>New to TokenFactory? <Link to="/signup">Create an account.</Link></p>
                        </div>
                    </ModuleBody>
                </Module>
            </div>
        )
    }
}

export default Login;
