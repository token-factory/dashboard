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
import lodash from 'lodash';

const OfferDetail = ({ parentState, handleCloseViewDetailModal }) => (
    <Modal
        id="offer-detail-modal"
        open={parentState.showViewDetailModal}
        passiveModal={true}
        modalHeading="Offer details"
        modalLabel=""
        modalAriaLabel=""
        iconDescription="Close"
        primaryButtonDisabled={true}
        onRequestClose={handleCloseViewDetailModal}
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
                    <StructuredListCell>Sell asset code</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'offerData.sellingassetcode')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Sell asset issuer</StructuredListCell>
                    <StructuredListCell title={lodash.get(parentState, 'offerData.sellingissuer')}>
                        {lodash.get(parentState, 'offerData.sellingissuer')
                            ? <Truncation text={lodash.get(parentState, 'offerData.sellingissuer')} />
                            : null}
                    </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Amount</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'offerData.amount')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Price</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'offerData.price')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Buy asset code</StructuredListCell>
                    <StructuredListCell>{lodash.get(parentState, 'offerData.buyingassetcode')}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                    <StructuredListCell>Buy asset issuer</StructuredListCell>
                    <StructuredListCell title={lodash.get(parentState, 'offerData.buyingissuer')}>
                        {lodash.get(parentState, 'offerData.buyingissuer')
                            ? <Truncation text={lodash.get(parentState, 'offerData.buyingissuer')} />
                            : null}
                    </StructuredListCell>
                </StructuredListRow>
            </StructuredListBody>
        </StructuredListWrapper>
    </Modal>
)

export default OfferDetail;
