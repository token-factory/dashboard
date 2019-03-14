import { TRUNCATE_START_LEN, TRUNCATE_END_LEN } from './constants';

export const copyTextToClipboard = (controlId, text) => {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text);
    } else if (
        document.queryCommandSupported
        && document.queryCommandSupported('copy')
    ) {
        const initControl = document.getElementById(controlId);
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        initControl.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.warn('Copy to clipboard failed.', ex);
            return false;
        } finally {
            initControl.removeChild(textarea);
        }
    }
};

export const truncate = (text, startLen, endLen) => {
    const separator = '...';
    startLen = startLen ? startLen : TRUNCATE_START_LEN;
    endLen = endLen ? endLen : TRUNCATE_END_LEN;

    return text && text.length > startLen && text.length > endLen ? text.substr(0, startLen) + separator + text.substr(text.length - endLen) : text;
}

//Take in number is string, and number of decimal to be rounded to
export const round = (number, decimal) => {
    const inputNumber = parseFloat(number);
    if (Number.isNaN(inputNumber)) {
        return number;
    }
    return inputNumber.toFixed(decimal);
}

//Adding , into number
export const splitNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const textTruncation = (text) => {
    if (!text) {
        return text;
    }
    if (text.length <= TRUNCATE_END_LEN || text.length <= TRUNCATE_START_LEN) {
        return text;
    }
    const firstPart = text && text.length > TRUNCATE_END_LEN ? text.substr(0, text.length - TRUNCATE_START_LEN) : '';
    const lastPart = text && text.length > TRUNCATE_END_LEN ? text.substr(text.length - TRUNCATE_END_LEN) : '';
    return `${firstPart}...${lastPart}`;
}
