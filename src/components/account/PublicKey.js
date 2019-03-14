import React from 'react';
import Truncation from '../utils/Truncation'
import { CopyButton, FormLabel } from 'carbon-components-react';
import { copyTextToClipboard } from '../../libs/common'

import '../../style/scss/publicKey.scss';

const PublicKey = ({ publicKey, label, isStandAlone }) => {
    let content = null;
    if (isStandAlone) {
        content = <div className="resource-table">
            <h4 className="bx--data-table-v2-header">{label}</h4>
            <div className="bx--snippet bx--snippet--single">
                <div role="textbox" tabIndex="0" className="bx--snippet-container" aria-label="code-snippet">
                    <code>
                        <pre>{publicKey}</pre>
                    </code>
                </div>
                <CopyButton
                    id="public-key-copy-btn"
                    onClick={() => copyTextToClipboard('public-key-copy-btn', publicKey)} />
            </div>
        </div>
    } else {
        content = <div className="bx--form-item">
            <FormLabel>{label}</FormLabel>
            <div className="bx--text-input inline-truncation">
                <Truncation id="trustAsset-assetIssuer" text={publicKey} />
            </div>
        </div>
    }


    return content;
};
export default PublicKey;
