import React, { Component } from 'react'
import { SelectItem, Select, SelectSkeleton, InlineNotification, TextInput } from 'carbon-components-react';
import { Query } from 'react-apollo';
import { GET_TRUSTEES_BY_ASSET } from '../../queries/account';

class Trustees extends Component {
    render() {
        const { assetCode, assetIssuer, onChange } = this.props;
        const { trusteeName, trusteeLabelText, trusteePlaceholder } = this.props.trusteeStatus;

        if (!assetCode || assetCode === 'XLM') {
            return (
                <TextInput
                    id={trusteeName}
                    name={trusteeName}
                    required
                    labelText={trusteeLabelText}
                    type="text"
                    placeholder={trusteePlaceholder}
                    onChange={event => onChange(event)}
                />
            )
        }
        return (
            <Query
                query={GET_TRUSTEES_BY_ASSET}
                variables={{ assetCode: assetCode, assetIssuer: assetIssuer }}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <SelectSkeleton />
                    } else if (error) {
                        return (
                            <InlineNotification
                                kind="error"
                                title="Trustees loading error"
                                subtitle="Unable to load trustees"
                            />
                        );
                    } else {
                        const trustees = data.allTrustlines.nodes;
                        return (
                            <Select
                                id={trusteeName}
                                name={trusteeName}
                                defaultValue=""
                                required
                                labelText={trusteeLabelText}
                                onChange={event => onChange(event)}
                            >
                                <SelectItem name="defaultSelect" value="" text="Select" />
                                {trustees.map(trustee => {
                                    const trusteePublicKey = trustee.accountid;
                                    return (
                                        <SelectItem
                                            key={trusteePublicKey}
                                            name={trusteePublicKey}
                                            value={trusteePublicKey}
                                            text={trusteePublicKey}
                                        />
                                    );
                                })}
                            </Select>
                        );
                    }
                }}
            </Query>
        )
    }
}

export default Trustees;
