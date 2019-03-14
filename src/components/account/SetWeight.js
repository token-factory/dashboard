import React, { Component } from 'react';
import { Modal, TextInput, Loading } from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { SET_WEIGHT_THRESHOLD, GET_ACCOUNT } from '../../queries/account';
import { apolloMutation, apolloSignTransaction } from '../../libs/apollo';
import PublicKey from './PublicKey';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    },
    {
        field: 'weight',
        method: 'isInt',
        args: [{ min: 0, max: 255 }],
        validWhen: true,
        message: 'Weight must be an integer between 0 and 255'
    },
    {
        field: 'low',
        method: 'isInt',
        args: [{ min: 0, max: 255 }],
        validWhen: true,
        message: 'Low threshold must be an integer between 0 and 255'
    },
    {
        field: 'medium',
        method: 'isInt',
        args: [{ min: 0, max: 255 }],
        validWhen: true,
        message: 'Medium threshold must be an integer between 0 and 255'
    },
    {
        field: 'high',
        method: 'isInt',
        args: [{ min: 0, max: 255 }],
        validWhen: true,
        message: 'High threshold must be an integer between 0 and 255'
    }
]);

const initialState = {
    weight: '0',
    low: '0',
    medium: '0',
    high: '0',
    passphrase: '',
    loading: false,
    preloadData: false,
    submitted: false,
    validation: validator.valid()
};
class SetWeight extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onInputChange = this.onInputChange.bind(this);
    }

    componentWillMount() {
        const thresholds = this.props.data.getAccount.thresholds;
        this.setState({
            publicKey: this.props.parentState.publicKey,
            weight: thresholds.master_weight,
            low: thresholds.low_threshold,
            medium: thresholds.med_threshold,
            high: thresholds.high_threshold
        });
    }

    onInputChange(e) {
        e.preventDefault();
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
        const { publicKey, weight, low, medium, high, passphrase } = this.state;
        try {
            this.startLoading();
            const refetchQueries = [
                {
                    query: GET_ACCOUNT,
                    variables: { publicKey: publicKey }
                }
            ];
            const setOptionVariables = {
                publicKey: publicKey,
                weight: parseInt(weight, 10),
                low: parseInt(low, 10),
                medium: parseInt(medium, 10),
                high: parseInt(high, 10)
            };

            //Set Option Transaction
            const setOptionResponse = await apolloMutation(
                SET_WEIGHT_THRESHOLD,
                setOptionVariables
            );
            const transactionId = setOptionResponse.data.createWeightThresholdTransaction.id;
            //Sign Transaction
            await apolloSignTransaction(
                publicKey,
                transactionId,
                passphrase,
                refetchQueries
            );
            this.stopLoading();
            this.props.handleCloseAddNew();
        } catch (error) {
            this.stopLoading();
        }
    }
    handleCloseAddNew() {
        this.props.handleCloseAddNew();
    }
    render() {
        const { publicKey, weight, low, medium, high, loading, validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        return (
            <Modal
                id="setWeight-modal"
                shouldSubmitOnEnter={true}
                modalHeading="Set options"
                open={true}
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Set options"
                secondaryButtonText="Close"
                iconDescription="Close"
                onSecondarySubmit={() => this.handleCloseAddNew()}
                onRequestClose={() => this.handleCloseAddNew()}
                onRequestSubmit={event => this.handleSubmit(event)}
            >
                {loading ? <Loading /> : null}
                {/* Public Key */}
                <PublicKey publicKey={publicKey} label='Public key' />
                {/* Weight */}
                <TextInput
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    max="255"
                    labelText="Weight"
                    placeholder={weight.toString()}
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.weight.isInvalid}
                    invalidText={formValidation.weight.message}
                />
                {/* Low */}
                <TextInput
                    id="low"
                    name="low"
                    type="number"
                    min="0"
                    max="255"
                    labelText="Low threshold"
                    placeholder={low.toString()}
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.low.isInvalid}
                    invalidText={formValidation.low.message}
                />
                {/* Medium */}
                <TextInput
                    id="medium"
                    name="medium"
                    type="number"
                    min="0"
                    max="255"
                    labelText="Medium threshold"
                    placeholder={medium.toString()}
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.medium.isInvalid}
                    invalidText={formValidation.medium.message}
                />
                {/* High */}
                <TextInput
                    id="high"
                    name="high"
                    type="number"
                    min="0"
                    max="255"
                    labelText="High threshold"
                    placeholder={high.toString()}
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.high.isInvalid}
                    invalidText={formValidation.high.message}
                />
                {/* passphrase  */}
                <PassphraseInput
                    id="passphrase"
                    name="passphrase"
                    placeholderText="Your passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
                />
            </Modal>
        );
    }
}

export default SetWeight;
