import React, { Component } from 'react';
import { Form, TextInput, Button } from 'carbon-components-react';
import { Module, ModuleBody } from 'carbon-addons-cloud-react';
import { graphql } from 'react-apollo';
import { RESET_PASSWORD } from '../../queries/register';
import { handleSuccess, handleError } from '../../libs/apollo';
import '../../style/scss/module.scss';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    async submitForm(event) {
        const { RESET_PASSWORD, history } = this.props;
        const { email } = this.state;
        event.preventDefault();
        try {
            const resetPasswordResponse = await RESET_PASSWORD({
                variables: {
                    email
                }
            });
            if (resetPasswordResponse.errors) {
                const errorMessage = resetPasswordResponse.errors[0].message;
                handleError(resetPasswordResponse.errors, 'Reset passsword error', errorMessage, true);
                return;
            }
            handleSuccess('Password reset', 'Your password was reset successfully.', true);
            history.push('/login');
        } catch (error) {
            handleError(error, 'Reset passsword error', error.message, true);
        }
    }

    handleCancel() {
        const { history } = this.props;
        history.push('/login');
    }

    render() {
        return (
            <div className="module-container">
                <h1>Reset your TokenFactory password</h1>
                <Module size="single">
                    <ModuleBody>
                        <Form className='module-container__form' onSubmit={event => this.submitForm(event)}>
                            <TextInput
                                id="reset-password-email"
                                type="email"
                                placeholder="Enter your email address"
                                labelText="Email address"
                                name="email"
                                autoComplete="email"
                                required
                                onChange={event => this.setState({ email: event.target.value })}
                            />
                            <div className="module-container__buttons">
                                <Button kind="secondary" type="button" onClick={() => this.handleCancel()}>Cancel</Button>
                                <Button kind="primary" type="submit">Submit</Button>
                            </div>
                        </Form>
                    </ModuleBody>
                </Module>
            </div>
        );
    }
}

export default graphql(RESET_PASSWORD, {
    name: 'RESET_PASSWORD'
})(ResetPassword);
