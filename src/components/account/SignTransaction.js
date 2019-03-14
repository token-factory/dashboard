import React, { Component } from 'react';
import {
    Modal,
    Loading,
    Accordion,
    AccordionItem,
    Checkbox
} from 'carbon-components-react';
import PassphraseInput from '../utils/PassphraseInput';
import { apolloSignTransaction } from '../../libs/apollo';
import FormValidator from '../utils/FormValidator';

import '../../style/scss/forms.scss';

const validator = new FormValidator([
    {
        field: 'passphrase',
        method: 'isEmpty',
        validWhen: false,
        message: 'Passphrase is required'
    }
]);

const initialState = {
    publicKey: '',
    passphrase: '',
    transactionId: '',
    submitted: false,
    validation: validator.valid()
};
class SignTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.onInputChange = this.onInputChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            publicKey: this.props.parentState.publicKey,
            transactionId: this.props.parentState.transactionId
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
    async handleSubmit() {
        const validation = validator.validate(this.state);
        this.setState({ validation });
        this.state.submitted = true;
        if (!validation.isValid) {
            return;
        }
        try {
            this.startLoading();
            //Sign Transaction
            await apolloSignTransaction(
                this.state.publicKey,
                this.state.transactionId,
                this.state.passphrase
            );
            this.stopLoading();
            this.props.handleCloseSignTransaction();
        } catch (error) {
            this.stopLoading();
            this.props.handleCloseSignTransaction();
        }
    }

    render() {
        const { validation, submitted } = this.state;
        const formValidation = submitted ? validator.validate(this.state) : validation;
        return (
            <Modal
                id="signTransaction-modal"
                open={true}
                danger={false}
                shouldSubmitOnEnter={true}
                modalHeading="Sign transaction"
                modalLabel=""
                modalAriaLabel=""
                primaryButtonText="Sign"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onSecondarySubmit={this.props.handleCloseSignTransaction}
                onRequestClose={this.props.handleCloseSignTransaction}
                onRequestSubmit={() => this.handleSubmit()}
            >
                {this.state && this.state.loading ? <Loading /> : null}
                <Accordion>
                    <AccordionItem title={<h4>Transaction ID</h4>}>
                        <p>{this.props.parentState.transactionId}</p>
                    </AccordionItem>
                    <AccordionItem title={<h4>Source account</h4>}>
                        <p>{this.props.parentState.sourceAccount}</p>
                    </AccordionItem>
                    <AccordionItem title={<h4>Transaction type</h4>}>
                        <p>{this.props.parentState.type}</p>
                    </AccordionItem>
                    <AccordionItem title={<h4>Description</h4>}>
                        <p>{this.props.parentState.description}</p>
                    </AccordionItem>
                    <AccordionItem title={<h4>Signers</h4>}>
                        {this.props.parentState.signers
                            ? this.props.parentState.signers.map(signer => {
                                return (
                                    <Checkbox
                                        key={signer.public_key}
                                        id={'signTransaction-signers'}
                                        defaultChecked={signer.signed ? true : false}
                                        className="signer-checkbox"
                                        labelText={signer.public_key}
                                    />
                                );
                            })
                            : null}
                    </AccordionItem>
                </Accordion>

                {/* passphrase  */}
                <PassphraseInput
                    id="coSignPassphrase"
                    placeholderText="Your passphrase"
                    name="passphrase"
                    labelText="Passphrase"
                    onChange={event => this.onInputChange(event)}
                    invalid={formValidation.passphrase.isInvalid}
                    invalidText={formValidation.passphrase.message}
                />
            </Modal>
        );
    }
}

export default SignTransaction;
