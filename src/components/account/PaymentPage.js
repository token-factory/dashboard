import React from 'react';
import PageHeader from './PageHeader';
import PaymentTable from './PaymentTable';

const PaymentPage = ({ parentState }) =>
    <div>
        <PageHeader
            pageType='payments'
            publicKey={parentState.publicKey}
        />
        <PaymentTable
            parentState={parentState}
        />
    </div>

export default PaymentPage;
