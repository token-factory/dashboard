import React from 'react'
import '../../style/scss/no-records.scss';
import { Icon } from 'carbon-components-react';

const NoRecords = ({
    title,
    detail,
    children
}) =>
    <div className="no-records">
        <div className="no-records__icon">
            <Icon
                name="block-chain"
                fill="#3d70b2"
                width="75px"
                height="75px"
                description="Blockchain icon" />
        </div>
        <div className="no-records__title">{title}</div>
        {detail && <div className="no-records__detail">{detail}</div>}
        {children}
    </div>

export default NoRecords
