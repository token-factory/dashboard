import React, { Component } from 'react';

import { CREATE_OFFER, GET_OFFERS } from '../../queries/account';
import { Form, Button, Loading, TextInput, FormGroup, } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import FeeAgreement, { OFFER_FEES } from '../utils/FeeAgreement';
import TrustedAsset from './TrustedAsset';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import { withRouter } from 'react-router-dom';
import '../../style/scss/forms.scss';
import FormValidator from '../utils/FormValidator';
import { STROOP_FACTOR } from '../../libs/constants';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'sellAmount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Sell amount is required'
    },
    {
        field: 'sellAmount',
        method: 'isFloat',
        args: [{ min: STROOP_FACTOR }],
        validWhen: true,
        message: 'Sell amount must be greater than 0'
    },
    {
        field: 'buyAmount',
        method: 'isEmpty',
        validWhen: false,
        message: 'Buy amount is required'
    },
    {
        field: 'buyAmount',
        method: 'isFloat',
        args: [{ min: STROOP_FACTOR }],
        validWhen: true,
        message: 'Buy amount must be greater than 0'
    },
]);

const initialState = {
    publicKey: '',
    sellAsset: '',
    sellAssetIssuer: '',
    sellAmount: '',
    buyAsset: '',
    buyAssetIssuer: '',
    buyAmount: '',
    passphrase: '',
    loading: false,
    feeAgreed: false,
    submitted: false,
    validation: validator.valid()
};
class CreateOffer extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
        this.pairInputChange = this.pairInputChange.bind(this);
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

    pairInputChange(event, parentInputName, childInputName, pairDict) {
        const parentValue = event.target.value;
        const childValue = pairDict[parentValue];
        this.setState({
            [parentInputName]: parentValue,
            [childInputName]: childValue
        });
    }

    onTriggerCreateOffer(transaction) {
        this.props.triggerCreateOffer(transaction);
    }
    goBack() {
        const url = `/account/${this.state.publicKey}/offers/initiated`;
        this.props.history.push(url);
    }
    async handleSubmit(e) {
        e.preventDefault();
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        const { publicKey, sellAssetCode, sellAssetIssuer, sellAmount, buyAssetCode, buyAssetIssuer, buyAmount, passphrase } = this.state;
        try {
            this.startLoading();
            const refetchQueries = [
                {
                    query: GET_OFFERS,
                    variables: { publicKey: publicKey }
                }
            ];
            const createOfferVariables = {
                publicKey, sellAssetCode, sellAssetIssuer, sellAmount, buyAssetCode, buyAssetIssuer, buyAmount
            };
            //Create Offer Transaction
            const createOfferResponse = await apolloMutation(
                CREATE_OFFER,
                createOfferVariables
            );
            const transaction = createOfferResponse.data.createOffer;
            //Sign Transaction
            const response = await apolloSignTransaction(publicKey, transaction.id, passphrase, refetchQueries);
            this.stopLoading();

            this.goBack();
            if (response) {
                this.onTriggerCreateOffer(transaction);
            }
        } catch (error) {
            this.stopLoading();
        }
    }
    onCheckboxChange(value) {
        this.setState({
            feeAgreed: value
        });
    }
    render() {
        const { feeAgreed, sellAssetIssuer, buyAssetIssuer, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        const prefixId = this.constructor.name;
        const { publicKey } = this.props.parentState;
        const createOfferForm = (
            <Form
                className="user-input-form"
                onSubmit={event => this.handleSubmit(event)}
            >
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col-sm-12 bx--col-md-6">
                            <FormGroup legendText="">
                                {/* Sell Asset */}
                                <TrustedAsset
                                    publicKey={publicKey}
                                    parentStatus={{
                                        parentInputName: 'sellAssetCode',
                                        parentLabelText: 'Sell asset code',
                                        parentRequire: true
                                    }}
                                    childStatus={{
                                        childInputName: 'sellAssetIssuer',
                                        childLabelText: 'Sell asset issuer',
                                        childRequire: true,
                                        childValue: sellAssetIssuer
                                    }}
                                    pairInputChange={this.pairInputChange}
                                />
                                {/* Sell Amount */}
                                <TextInput
                                    id="sellAmount"
                                    name="sellAmount"
                                    type="number"
                                    placeholder="Sell amount"
                                    labelText="Sell amount"
                                    invalid={formValidation.sellAmount.isInvalid}
                                    invalidText={formValidation.sellAmount.message}
                                    onChange={event => this.onInputChange(event)}
                                />
                            </FormGroup>
                        </div>
                        <div className="bx--col-xs-6">
                            <FormGroup legendText="">
                                {/* Buy Asest */}
                                <TrustedAsset
                                    publicKey={publicKey}
                                    parentStatus={{
                                        parentInputName: 'buyAssetCode',
                                        parentLabelText: 'Buy asset code',
                                        parentRequire: true
                                    }}
                                    childStatus={{
                                        childInputName: 'buyAssetIssuer',
                                        childLabelText: 'Buy asset issuer',
                                        childRequire: true,
                                        childValue: buyAssetIssuer
                                    }}
                                    pairInputChange={this.pairInputChange}
                                />
                                {/* Buy Amount */}
                                <TextInput
                                    id="buyAmount"
                                    name="buyAmount"
                                    type="number"
                                    placeholder="Buy amount"
                                    labelText="Buy amount"
                                    onChange={event => this.onInputChange(event)}
                                    invalid={formValidation.buyAmount.isInvalid}
                                    invalidText={formValidation.buyAmount.message}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="bx--row">
                        <div className="bx--col-xs-12">

                            {/* passphrase  */}
                            <PassphraseInput
                                id="createOfferPassphrase"
                                placeholderText="Your passphrase"
                                name="passphrase"
                                labelText="Passphrase"
                                onChange={event => this.onInputChange(event)}
                                invalid={formValidation.passphrase.isInvalid}
                                invalidText={formValidation.passphrase.message}
                            />
                            {/* Fees */}
                            <FeeAgreement
                                controlId={`${prefixId}feeAgreement`}
                                feeType={OFFER_FEES}
                                onCheckboxChange={(value, id) =>
                                    this.onCheckboxChange(value, id)
                                }
                            />
                            <div className="form-buttons">
                                <Button
                                    kind="secondary"
                                    onClick={() => this.goBack()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!feeAgreed}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        );

        return (
            <div>
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col-xxl-8 bx--col-xl-12">
                            {createOfferForm}
                        </div>
                    </div>
                </div>
                {this.state.loading ? <Loading /> : null}
            </div>
        );
    }
}

export default withRouter(CreateOffer);
