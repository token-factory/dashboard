//duplicate asset check
export const duplicateAssetCheck = (assetCode, assetIssuer, data) => {
    const allAsset = data.getAssets;
    return !!allAsset.find(asset => asset.asset_code === assetCode && asset.asset_issuer === assetIssuer)
}

//get trusted asset list
export const getTrustedAssets = (balanceArray, allAssetsArrary, publicKey) => {
    const trustedAssets = [];
    balanceArray.forEach(asset => {
        const { asset_code, asset_issuer, balance } = asset;
        trustedAssets.push({
            assetCode: asset_code ? asset_code : 'XLM',
            assetIssuer: asset_issuer ? asset_issuer : 'Native',
            balance: balance
        })
    });
    allAssetsArrary.forEach(asset => {
        const { asset_code, asset_issuer } = asset;
        if (asset_issuer === publicKey) {
            trustedAssets.push({
                assetCode: asset_code,
                assetIssuer: asset_issuer,
                balance: 'unlimited' //self-issued asset with unlimited balance
            })
        }
    });
    return trustedAssets;
}
