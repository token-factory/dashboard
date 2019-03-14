import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { handleSuccess } from '../../libs/apollo';

class LogoutButton extends Component {
    async clickLogOut() {
        localStorage.setItem('authToken', '');
        handleSuccess('Success!', 'Sign out successful.', true);
    }

    render() {
        return (
            <Link to="/login" onClick={() => this.clickLogOut()}>
                Sign out
            </Link>
        );
    }
}

export default LogoutButton;
