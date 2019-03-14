import React, { Component } from 'react';
import { SelectItem, Select, SelectSkeleton, InlineNotification } from 'carbon-components-react';
import { Query } from 'react-apollo';
import { ALL_ASSETS } from '../../queries/account';
import { getTrustedAssets } from '../../libs/libs';
import PublicKey from './PublicKey';

class TrustedAsset extends Component {
    render() {
        const { publicKey, selectAsset, pairInputChange, parentStatus, childStatus } = this.props;
        return (
            <Query query={ALL_ASSETS} variables={{ publicKey }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <SelectSkeleton />
                    } else if (error) {
                        return (
                            <InlineNotification
                                kind="error"
                                title="Asset loading error"
                                subtitle="Unable to load assets"
                            />
                        );
                    } else {
                        const { getBalances, getAssets } = data;
                        const trustedAssets = getTrustedAssets(getBalances, getAssets, publicKey);
                        let pairDict = {};
                        const pairListItems = trustedAssets.map(item => {
                            const { assetCode, assetIssuer } = item;
                            const curItem = { [assetCode]: assetIssuer };
                            pairDict = { ...pairDict, ...curItem };
                            return (
                                { assetCode: assetCode, assetIssuer: assetIssuer }
                            )
                        })
                        const { parentInputName, parentLabelText, parentRequire } = parentStatus;
                        const { childInputName, childLabelText, childValue } = childStatus;
                        return (
                            <div className="asset-pairInput">
                                <Select
                                    id={parentInputName}
                                    name={parentInputName}
                                    defaultValue={selectAsset ? selectAsset.assetCode : ''}
                                    required={parentRequire}
                                    labelText={parentLabelText}
                                    onChange={event => pairInputChange(event, parentInputName, childInputName, pairDict)}
                                >
                                    <SelectItem name='defaultSelect' value='' text='Select asset' />
                                    {pairListItems.map(asset => (
                                        <SelectItem
                                            key={`${asset.assetCode}${asset.assetIssuer}`}
                                            value={asset.assetCode}
                                            text={asset.assetCode}
                                        />
                                    ))}
                                </Select>
                                <PublicKey publicKey={selectAsset ? selectAsset.assetIssuer : childValue} label={childLabelText} />
                            </div>
                        );
                    }
                }}
            </Query>
        );
    }
}

export default TrustedAsset;
