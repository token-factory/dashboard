import React from 'react';
import { Card, CardFooter } from 'carbon-addons-cloud-react';
import { Icon, Link, Tag } from 'carbon-components-react';
import Truncation from '../utils/Truncation'
import { round, splitNumber } from '../../libs/common';

import '../../style/scss/asset-card.scss';

const AssetCard = ({ assetCode, assetBalance, assetIssuer, publicKey, icon }) =>
    <div>
        <Card className='asset-card'>
            <div className='bx--grid'>
                <div className='asset-content bx--row'>
                    <div className='asset-content-left bx--col-xs-3'>
                        <div className='bx--detail-page-header-icon-container'>
                            {icon ? icon : (
                                <Icon
                                    className='asset-icon'
                                    name='finance'
                                    width='25px'
                                    height='25px'
                                    description="Asset icon" />
                            )}
                        </div>
                        <div className='bx--detail-page-header-tag-container'>
                            <Tag className='asset-tag' type={assetIssuer === publicKey ? 'private' : 'beta'} disabled={false}>{assetIssuer === publicKey ? 'Mine' : 'Market'}</Tag>
                        </div>
                    </div>
                    <div className='asset-content-right bx--col-xs-9'>
                        <div className='asset-code'>{assetCode ? assetCode : 'XLM'}</div>
                        <div className='asset-issuer'>
                            <div>by</div>
                            <Truncation text={assetIssuer ? assetIssuer : 'Native'} />
                        </div>
                        <div className='asset-balance'>{splitNumber(round(assetBalance, 2))}</div>
                    </div>
                </div>
            </div>
            <CardFooter>
                <Link
                    onClick={() => {
                        localStorage.setItem('selectAsset', JSON.stringify({
                            assetCode: assetCode,
                            assetIssuer: assetIssuer ? assetIssuer : 'Native'
                        }))
                    }}
                    href={`#/account/${publicKey}/payments/create`}
                >Make payment</Link>
            </CardFooter>
        </Card>
    </div>

export default AssetCard;
