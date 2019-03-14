import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { InlineLoading, InlineNotification, Link } from 'carbon-components-react';
import { GET_WAITING_APPROVAL_ASSETS } from '../../queries/account';

const WaitingAssetsNotification = ({ publicKey }) => (
    <Query query={GET_WAITING_APPROVAL_ASSETS} variables={{ issuer: publicKey }}>
        {({ loading, error, data }) => {
            if (loading) {
                return <div className="resource-table"><InlineLoading description="Loading ..." /></div>;
            }
            if (error) {
                return <p>An error occurred while loading awaiting-approval assets.</p>;
            }
            const trustLines = data.allTrustlines;
            const waitingAssetsNum = trustLines && trustLines.nodes ? trustLines.nodes.length : 0;
            let toastContent = null;
            if (waitingAssetsNum > 0) {
                const assetsUrl = window && window.location ? window.location.hash.replace('overview', 'assets/approval') : '';
                const assetWord = waitingAssetsNum > 1 ? 'assets' : 'asset';
                const message = <Fragment>{`You have ${waitingAssetsNum} awaiting approval ${assetWord}. `}
                    <Link href={assetsUrl}>Approve now</Link>
                </Fragment>;
                toastContent = <div className="resource-table">
                    <InlineNotification
                        kind="info"
                        title="Awaiting-approval assets"
                        subtitle={message}
                        iconDescription="Close button"
                    />
                </div>
            }
            return toastContent;
        }}
    </Query>
);

export default WaitingAssetsNotification;
