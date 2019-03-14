import React, { Component } from 'react';
import { TextInput, Button } from 'carbon-components-react';

import '../../style/scss/forms.scss';

class PassphraseInput extends Component {
    state = {
        inputType: 'password'
    };
    render() {
        const {
            id,
            name,
            placeholderText,
            labelText,
            onChange,
            otherTextInputProps,
            enableAutoComplete,
            invalid,
            invalidText
        } = this.props;
        return (
            <div className="sensitive-data">
                <TextInput
                    id={id}
                    name={name}
                    placeholder={placeholderText}
                    labelText={labelText}
                    onChange={event => onChange(event)}
                    type={this.state.inputType}
                    autoComplete={enableAutoComplete ? 'current-password' : 'new-password'}
                    {...otherTextInputProps}
                    invalid={invalid}
                    invalidText={invalidText}
                />
                <Button
                    kind="ghost"
                    title="Toggle show/hide"
                    icon={`visibility-${this.state.inputType === 'password' ? 'on' : 'off'}`}
                    onClick={() => this.toggleInputType()} />
            </div>
        );
    }
    toggleInputType() {
        this.setState({
            inputType: this.state.inputType === 'password' ? 'text' : 'password'
        });
    }
}

export default PassphraseInput;
