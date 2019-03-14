import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_SIGNERS } from '../../queries/account';
import { InlineLoading, ListItem, FormGroup } from 'carbon-components-react';

class CoSigners extends Component {
    render() {
        const { publicKey } = this.props;
        return (
            <Query
                query={GET_SIGNERS}
                variables={{ publicKey: publicKey }}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <InlineLoading description="Loading signers..." />
                    } else if (error) {
                        // eslint-disable-next-line no-console
                        console.error(error);
                        return null;
                    } else {
                        const signers = data.getAccount.signers;
                        const signersOutput = [];
                        signers.map(signer => {
                            if (signer.key !== publicKey) {
                                signersOutput.push(<ListItem key={signer.key}>{signer.key}</ListItem>);
                            }
                            return null;
                        });

                        if (signersOutput.length > 0) {
                            return (
                                <FormGroup legendText="Signers">
                                    {signersOutput}
                                </FormGroup>
                            )
                        } else {
                            return null;
                        }
                    }
                }}
            </Query>
        )
    }
}

export default CoSigners;
