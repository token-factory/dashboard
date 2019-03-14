import React, { Component } from 'react';
import jsonwebtoken from 'jsonwebtoken';
import { CHANGE_PASSWORD } from '../../queries/register';
import PassphraseInput from '../utils/PassphraseInput';
import { Form, Button } from 'carbon-components-react';
import { apolloMutation, handleError, handleSuccess } from '../../libs/apollo';
import { Module, ModuleBody } from 'carbon-addons-cloud-react';

import '../../style/scss/common.scss';
import '../../style/scss/module.scss';

const initialState = {
    loggedInUser: {},
    currentpassword: '',
    confirmpassword: '',
    newpassword: ''
}
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const token = localStorage.getItem('authToken');
        const loggedInUser = token ? jsonwebtoken.decode(token) : {};
        this.setState({
            loggedInUser: loggedInUser
        });
    }

    async handleSuccess() {
        const successTitle = 'Success!';
        const successMessage = 'Change password successful'
        handleSuccess(successTitle, successMessage, true);
        this.props.history.push('/login');
    }

    async submitForm(event) {
        event.preventDefault();
        const { newpassword, confirmpassword, loggedInUser, currentpassword } = this.state;
        //UI form valid check
        if (newpassword !== confirmpassword) {
            const errorTitle = 'Password mismatch';
            const errorMessage = 'Your password and confirmation password do not match';
            handleError(null, errorTitle, errorMessage);
            return;
        }
        try {
            //Change Password
            const changePasswordVariables = {
                email: loggedInUser.email,
                currentpassword,
                newpassword
            }
            await apolloMutation(CHANGE_PASSWORD, changePasswordVariables);

            //Success
            this.handleSuccess();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    onInputChange(keyName, e) {
        this.setState({ [keyName]: e.target.value });
    }

    render() {
        return (
            <div className="module-container module-container__with-header">
                <h1>Change password</h1>
                <Module size="single">
                    <ModuleBody>
                        <Form className='module-container__form' onSubmit={event => this.submitForm(event)}>
                            <PassphraseInput
                                id="current-password"
                                placeholderText="Enter your current password"
                                name="password"
                                labelText="Current password"
                                enableAutoComplete={true}
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.onInputChange('currentpassword', event)}
                            />
                            <PassphraseInput
                                id="new-password"
                                name="password"
                                placeholder="Enter your new password"
                                labelText="New password"
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.onInputChange('newpassword', event)}
                            />
                            <PassphraseInput
                                id="confirm-password"
                                name="password"
                                placeholder="Confirm your new password"
                                labelText="Confirm password"
                                otherTextInputProps={{ required: true }}
                                onChange={event => this.onInputChange('confirmpassword', event)}
                            />
                            <div className="module-container__buttons">
                                <Button kind="primary" type="submit">Change password</Button>
                            </div>
                        </Form>
                    </ModuleBody>
                </Module>
            </div>
        );
    }
}

export default ChangePassword;
