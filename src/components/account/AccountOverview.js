import React, { Component, Fragment } from 'react';
import PaymentTable from './PaymentTable';
import { graphql } from 'react-apollo';
import { GET_ACCOUNT } from '../../queries/account';
import WaitingAssetsNotification from '../utils/WaitingAssetsNotification'
import '../../style/scss/account-overview.scss';

const initialState = {
    format: 'list',
}
class AccountOverview extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillMount() {
        const publicKey = this.props.parentState.publicKey;
        this.setState({
            publicKey: publicKey
        });
    }

    radioChange(event) {
        this.setState(event);
    }

    render() {
        const { publicKey } = this.state;
        const getAccount = this.props.GET_ACCOUNT;
        return (
            <Fragment>
                <WaitingAssetsNotification publicKey={publicKey} />
                <PaymentTable parentState={this.state} data={getAccount} />
            </Fragment>
        )
    }
}

export default graphql(GET_ACCOUNT, {
    name: 'GET_ACCOUNT',
    options: props => {
        return {
            variables: {
                publicKey: props.parentState.publicKey
            }
        };
    }
})(AccountOverview);
