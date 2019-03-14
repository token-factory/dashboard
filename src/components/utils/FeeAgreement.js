import React from 'react';
import { InlineLoading, Checkbox } from 'carbon-components-react';
import { Query } from 'react-apollo';
import { GET_FEES } from '../../queries/account';

export const OFFER_FEES = 'FEE_OFFER';
export const ISSUE_FEES = 'FEE_ISSUANCE';

const FeeAgreement = ({ feeType, onCheckboxChange, controlId }) => (
    <Query query={GET_FEES} variables={{ type: feeType }}>
        {({ loading, error, data }) => {
            if (loading) {
                return <InlineLoading description="Loading fees..." />;
            }
            if (error) {
                return <p>An error occurred while loading fees.</p>;
            }

            const feeData = data.getFee;
            return (
                <Checkbox
                    labelText={`I agree to ${feeData.name}: ${feeData.rate} ${
                        feeData.type
                    }`}
                    onChange={(value, id) => onCheckboxChange(value, id)}
                    id={controlId}
                />
            );
        }}
    </Query>
);

export default FeeAgreement;
