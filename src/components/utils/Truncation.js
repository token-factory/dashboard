import React from 'react';
import { TRUNCATE_START_LEN, TRUNCATE_END_LEN } from '../../libs/constants';
import '../../style/scss/truncation.scss';

const Truncation = ({ text }) => {
    if (text === null || text === undefined) {
        return null;
    }
    if (text.length <= TRUNCATE_END_LEN || text.length <= TRUNCATE_START_LEN) {
        return text;
    }
    const firstPart = text && text.length > TRUNCATE_END_LEN ? text.substr(0, text.length - TRUNCATE_END_LEN) : '';
    const lastPart = text && text.length > TRUNCATE_END_LEN ? text.substr(text.length - TRUNCATE_END_LEN) : '';
    return (
        <div className="truncation-container">
            <span className={'first-part'}>{firstPart}</span><span className={'last-part'}>{lastPart}</span>
        </div>
    )
};
export default Truncation;
