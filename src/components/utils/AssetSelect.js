import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_ASSETS } from '../../queries/account';
import { Select, SelectItem, InlineNotification } from 'carbon-components-react';
import { textTruncation } from '../../libs/common';

import '../../style/scss/asset-select.scss';

class AssetSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getAssetDroplist(data, title, type, onChange) {
        const nativeAsset = {
            asset_code: 'XLM',
            asset_issuer: 'Native',
            description: 'native asset XLM',
            type: type
        };
        return (
            <Select
                id={`${title}-select`}
                defaultValue=''
                required
                labelText={`${title}`}
                onChange={event => onChange(event)}
            >
                <SelectItem name='defaultSelect' value='' text='None' />
                <SelectItem value={JSON.stringify(nativeAsset)} text={'XLM by Native'} />
                {data.getAssets.map(asset => {
                    const { asset_code, asset_issuer } = asset;
                    const retValue = { ...asset, type: type };
                    const truncationValue = textTruncation(asset_issuer);
                    return (<SelectItem
                        key={`${asset_code}-${asset_issuer}`}
                        value={JSON.stringify(retValue)}
                        text={`${asset_code} by ${truncationValue}`}
                    />);
                })}
            </Select>
        )
    }

    render() {
        const { title, type, onChange } = this.props;
        const assetErrorNotification = (
            <InlineNotification
                kind='error'
                title='Error'
                subtitle='An unexpected error occured. Please try again.'
            />
        )
        return (
            <Query query={GET_ASSETS}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <div>Loading ...</div>
                    } else if (error) {
                        return assetErrorNotification;
                    } else {
                        return (
                            <div className='assetSelect'>
                                {this.getAssetDroplist(data, title, type, onChange)}
                            </div>
                        )
                    }
                }}
            </Query>
        )
    }
}

export default AssetSelect;
