import React from 'react';
import {
    Modal,
    StructuredListWrapper,
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell
} from 'carbon-components-react';
import Truncation from '../utils/Truncation'
import lodash from 'lodash'

const TransactionDetail = ({ parentState, handleCloseCheckTransaction }) => (
    <Modal
        id="transaction-detail-modal"
        open={parentState.checkTransaction}
        passiveModal={true}
        modalHeading="Transaction details"
        modalLabel=""
        modalAriaLabel=""
        iconDescription="Close"
        onRequestClose={handleCloseCheckTransaction}
    >
        <StructuredListWrapper className='bx--structured-list--condensed'>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell head>Name</StructuredListCell>
                    <StructuredListCell head>Description</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
                <StructuredListRow>
                    <StructuredListCell>ID</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'transactionId')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Type</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'type')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Description</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'description')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Signers</StructuredListCell>
                    <StructuredListCell>
                        <ul>
                            {parentState.signers && parentState.signers.map(signer => {
                                return signer.signed ? <li key={signer.public_key} title={signer.public_key}><Truncation text={signer.public_key} /></li> : null;
                            })}
                        </ul>
                    </StructuredListCell>
                </StructuredListRow>
            </StructuredListBody>
        </StructuredListWrapper>
    </Modal>
)

export default TransactionDetail;
