import React, { Component } from 'react';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import { CREATE_PAYMENT, GET_BALANCES, GET_ACCOUNT } from '../../queries/account';
import TrustedAsset from './TrustedAsset';
import Trustees from './Trustees';
import CoSigners from './CoSigners';
import PassphraseInput from '../utils/PassphraseInput';
import { TextInput, Form, Button, Loading } from 'carbon-components-react';
import { withRouter } from 'react-router-dom';
import FormValidator from '../utils/FormValidator';
import { STROOP_FACTOR } from '../../libs/constants';

import '../../style/scss/forms.scss'

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'amount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Amount is required'
    },
    {
        field: 'amount',
        method: 'isFloat',
        args: [{ min: STROOP_FACTOR }],
        validWhen: true,
        message: 'Amount must be greater than 0'
    },
]);

const initialState = {
    senderPublicKey: '',
    assetCode: '',
    assetIssuer: '',
    receiverPublicKey: '',
    amount: '',
    passphrase: '',
    loading: false,
    submitted: false,
    validation: validator.valid()
};

class CreatePayment extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
        this.pairInputChange = this.pairInputChange.bind(this);
        this.clearSelectAsset = this.clearSelectAsset.bind(this);
    }

    componentWillMount() {
        const selectAsset = JSON.parse(localStorage.getItem('selectAsset'));
        const { publicKey, assetCode, assetIssuer } = this.props.parentState;

        this.setState({
            senderPublicKey: publicKey,
            assetCode: selectAsset ? selectAsset.assetCode : assetCode,
            assetIssuer: selectAsset ? selectAsset.assetIssuer : (assetIssuer ? assetIssuer : ' ')
        });
    }

    pairInputChange(event, parentInputName, childInputName, pairDict) {
        const parentValue = event.target.value;
        const childValue = parentValue ? pairDict[parentValue] : '';
        localStorage.setItem('selectAsset', JSON.stringify({
            assetCode: parentValue,
            assetIssuer: childValue
        }))
        this.setState({
            [parentInputName]: parentValue,
            [childInputName]: childValue
        });
    }

    clearSelectAsset() {
        localStorage.setItem('selectAsset', null);
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
    onCancel() {
        this.clearSelectAsset();
        this.goBack();
    }
    goBack() {
        this.props.history.goBack();
    }
    async handleSubmit(event) {
        event.preventDefault();
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { senderPublicKey, receiverPublicKey, assetCode, assetIssuer, amount, passphrase } = this.state;
        try {
            this.startLoading();
            const refetchQueries = [
                {
                    query: GET_BALANCES,
                    variables: { publicKey: senderPublicKey }
                },
                {
                    query: GET_ACCOUNT,
                    variables: { publicKey: senderPublicKey }
                }
            ];
            const paymentVariable = {
                senderPublicKey, receiverPublicKey, assetCode, assetIssuer, amount
            }
            //Create Payment Transaction
            const createPaymentResponse = await apolloMutation(
                CREATE_PAYMENT,
                paymentVariable
            );
            const transactionId = createPaymentResponse.data.createPayment.id;
            //Sign Transaction
            await apolloSignTransaction(
                senderPublicKey,
                transactionId,
                passphrase,
                refetchQueries
            );
            this.clearSelectAsset();
            this.stopLoading();
            this.goBack();
        } catch (error) {
            this.stopLoading();
        }
    }

    render() {
        const { senderPublicKey, assetCode, assetIssuer, loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const createPaymentForm = (
            <Form
                className="user-input-form"
                onSubmit={event => this.handleSubmit(event)}
            >
                {/* Payment Asset  */}
                <TrustedAsset
                    publicKey={senderPublicKey}
                    selectAsset={JSON.parse(localStorage.getItem('selectAsset'))}
                    parentStatus={{
                        parentInputName: 'assetCode',
                        parentLabelText: 'Asset code',
                        parentRequire: true
                    }}
                    childStatus={{
                        childInputName: 'assetIssuer',
                        childLabelText: 'Asset issuer',
                        childRequire: true,
                        childValue: assetIssuer
                    }}
                    pairInputChange={this.pairInputChange}
                />
                {/* Payment Receiver  */}
                <Trustees
                    assetCode={assetCode}
                    assetIssuer={assetIssuer}
                    trusteeStatus={{
                        trusteeName: 'receiverPublicKey',
                        trusteeLabelText: 'Receiver public key',
                        trusteePlaceholder: 'Receiver public key',
                    }}
                    onChange={this.onInputChange}
                />
                {/* Transaction Amount */}
                <TextInput
                    id="amount"
                    name="amount"
                    labelText="Amount"
                    type="number"
                    placeholder="Amount"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.amount.isInvalid}
                    invalidText={formValidation.amount.message}
                />
                {/* Passphrase  */}
                <PassphraseInput
                    id="paymentPassphrase"
                    placeholderText="Your passphrase"
                    name="passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
                />
                {/* Signers  */}
                <CoSigners publicKey={senderPublicKey} />
                {/* Buttons */}
                <div className="form-buttons">
                    <Button
                        kind="secondary"
                        href={`#/account/${senderPublicKey}/overview`}
                        onClick={() => this.onCancel()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit"> Create </Button>
                </div>
            </Form>
        )
        return (
            <div>
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col-xxl-4 bx--col-xl-9 bx--col-md-12">
                            {createPaymentForm}
                        </div>
                    </div>
                </div>
                {loading ? <Loading /> : null}
            </div>
        );
    }
}
export default withRouter(CreatePayment);
