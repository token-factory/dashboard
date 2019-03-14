import gql from 'graphql-tag';

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $description: String
    $passphrase: String!
    $trust_auth_required: Boolean
    $home_domain: String
  ) {
    createAccount(
      description: $description
      passphrase: $passphrase
      trust_auth_required: $trust_auth_required
      home_domain: $home_domain
    ) {
      ... on TF_Account {
        email
        tenantId
        description
        home_domain
      }
      public_key
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query {
    getAccounts {
      ... on TF_Account {
        id
        email
        description
        tenantId
        createdAt
        updatedAt
        home_domain
      }
      public_key
    }
  }
`;

export const GET_ACCOUNT = gql`
  query getAccount($publicKey: String!) {
    getAccount(public_key: $publicKey) {
      ... on TF_Account {
        id
        email
        description
        tenantId
        home_domain
      }

      public_key
      balances {
        asset_type
        asset_code
        asset_issuer
        balance
        buying_liabilities
        selling_liabilities
      }

      thresholds {
        master_weight
        low_threshold
        med_threshold
        high_threshold
      }

      signers {
        master
        weight
        key
        type
      }

      flags {
        auth_required
        auth_revocable
        auth_immutable
      }
    }
  }
`;

export const GET_SIGNERS = gql`
  query getSigners($publicKey: String!) {
    getAccount(public_key: $publicKey) {
      public_key
      signers {
        key
        type
        weight
        master
      }
      ... on TF_Account {
        id
      }      
    }
  }
`;

export const GET_THRESHOLDS = gql`
  query getThresholds($publicKey: String!) {
    getAccount(public_key: $publicKey) {
      public_key
      thresholds {
        master_weight
        low_threshold
        med_threshold
        high_threshold
      }
    }
  }
`;

export const GET_BALANCES = gql`
  query getBalances($publicKey: String!) {
    getBalances(public_key: $publicKey) {
      network
      asset_code
      asset_issuer
      balance
    }
  }
`;

export const GET_HISTORY = gql`
  query getHistory($publicKey: String!, $type: String) {
    getHistory(public_key: $publicKey, type: $type) {
      id
      source_account
      type
      created_at
      transaction_hash
      ... on Create_Account {
        starting_balance
        account
      }
      ... on Change_Trust {
        trustor
        trustee
        limit
        asset_issuer
        asset_code
      }
      ... on Payment {
        from
        to
        amount
        asset_code
        memo
      }
      ... on Set_Signers {
        signer_key
        signer_weight
      }
      ... on Set_Threshold {
        master_key_weight
        low_threshold
        med_threshold
        high_threshold
      }
      ... on Manage_Offer {
        offer_id
        selling_asset_code
        selling_asset_issuer
        buying_asset_code
        buying_asset_issuer
        amount
        price
      }
      ... on Account_Flags {
        clear_flags
        clear_flags_s
        set_flags
        set_flags_s
      }
      ... on Allow_Trust {
        asset_type
        asset_code
        asset_issuer
        trustor
        trustee
        authorize
      }
      ... on Home_Domain {
        home_domain
      }
    }
  }
`;

export const GET_HISTORY_PAYMENT = gql`
query getHistory($publicKey: String!, $type: String) {
    getHistory(public_key: $publicKey, type: $type) {
      ... on Payment {
        id
        source_account
        type
        created_at
        transaction_hash
        from
        to
        amount
        asset_code
        memo
      }
    }
  }
`

export const GET_HISTORY_OFFER = gql`
query getHistory($publicKey: String!, $type: String) {
    getHistory(public_key: $publicKey, type: $type) {
    ... on Manage_Offer {
        id
        source_account
        type
        created_at
        transaction_hash
        offer_id
        selling_asset_code
        selling_asset_issuer
        buying_asset_code
        buying_asset_issuer
        amount
        price
        }
    }
  }
`

export const GET_HISTORY_OPTION = gql`
query getHistory($publicKey: String!, $type: String) {
    getHistory(public_key: $publicKey, type: $type) {
      ... on Set_Signers {
        id
        source_account
        type
        created_at
        transaction_hash
        signer_key
        signer_weight
      }
      ... on Set_Threshold {
        id
        source_account
        type
        created_at
        transaction_hash
        master_key_weight
        low_threshold
        med_threshold
        high_threshold
      }
      ... on Account_Flags {
        id
        source_account
        type
        created_at
        transaction_hash
        clear_flags
        clear_flags_s
        set_flags
        set_flags_s
      }
      ... on Home_Domain {
        id
        source_account
        type
        created_at
        transaction_hash
        home_domain
      }
    }
  }
`

export const GET_HISTORY_TRUST = gql`
query getHistory($publicKey: String!, $type: String) {
    getHistory(public_key: $publicKey, type: $type) {
        ... on Change_Trust {
            id
            source_account
            type
            created_at
            transaction_hash
            trustor
            trustee
            limit
            asset_code            
            asset_issuer
        }
        ... on Allow_Trust {
            id
            source_account
            type
            created_at
            transaction_hash
            asset_type
            asset_code
            asset_issuer
            trustor
            trustee
            authorize
        }
    }
}
`

export const MAKE_PAYMENT = gql`
  mutation makePayment(
    $senderPublicKey: String!
    $senderSecret: String!
    $receiverPublicKey: String!
    $assetCode: String!
    $assetIssuer: String!
    $amount: String!
  ) {
    makePayment(
      senderPublicKey: $senderPublicKey
      senderSecret: $senderSecret
      receiverPublicKey: $receiverPublicKey
      assetCode: $assetCode
      assetIssuer: $assetIssuer
      amount: $amount
    ) {
      hash
      ledger
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation createPayment(
    $senderPublicKey: String!
    $receiverPublicKey: String!
    $assetCode: String!
    $assetIssuer: String!
    $amount: String!
  ) {
    createPayment(
      sender_public_key: $senderPublicKey
      receiver_public_key: $receiverPublicKey
      asset_code: $assetCode
      asset_issuer: $assetIssuer
      amount: $amount
    ) {
      source_acct
      xdr_representation
      id
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation createAsset(
    $assetCode: String!
    $assetIssuer: String!
    $description: String!
  ) {
    createAsset(
      asset_code: $assetCode
      asset_issuer: $assetIssuer
      description: $description
    ) {
      asset_issuer
      asset_code
    }
  }
`;

export const TRUST_ASSET = gql`
  mutation trustAsset(
    $trustorPublicKey: String!
    $assetCode: String!
    $assetIssuer: String!
    $limit: String!
  ) {
    createTrustTransaction(
      trustor_public_key: $trustorPublicKey
      asset_code: $assetCode
      asset_issuer: $assetIssuer
      limit: $limit
    ) {
      id
      type
    }
  }
`;

export const GET_ASSETS = gql`
  query getAssets {
    getAssets {
      asset_code
      asset_issuer
      ... on TF_Asset {
        description
        tenantId
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_WAITING_ASSETS = gql`
query allTrustlines($issuer: String!) {
    allTrustlines(
        filter: {
            issuer: { equalTo: $issuer }
        }
    ) {
        nodes {
            id
            assetcode
            accountid
            tlimit
            flags
        }
    }
}
`;

export const GET_WAITING_APPROVAL_ASSETS = gql`
query allTrustlines($issuer: String!) {
    allTrustlines(
        filter: {
            issuer: { equalTo: $issuer },
            flags: { equalTo: 0 }
        }
    ) {
        nodes {
            id
            assetcode
            accountid
            tlimit
            flags
        }
    }
}
`;

export const ADD_SIGNER = gql`
  mutation createSignerTransaction(
    $publicKey: String!
    $signer: String!
    $weight: Int!
  ) {
    createSignerTransaction(
      public_key: $publicKey
      signer: $signer
      weight: $weight
    ) {
      id
      type
      source_acct
    }
  }
`;

export const DELETE_SIGNER = gql`
  mutation createSignerTransaction(
    $publicKey: String!
    $signer: String!
    $weight: Int!
  ) {
    createSignerTransaction(
      public_key: $publicKey
      signer: $signer
      weight: $weight
    ) {
      id
      type
      source_acct
    }
  }
`;

export const SET_WEIGHT_THRESHOLD = gql`
  mutation setWeightThresholdOptions(
    $publicKey: String!
    $weight: Int!
    $low: Int!
    $medium: Int!
    $high: Int!
  ) {
    createWeightThresholdTransaction(
      public_key: $publicKey
      weight: $weight
      low: $low
      medium: $medium
      high: $high
    ) {
      id
      type
      source_acct
    }
  }
`;

export const GET_INITIATED_TRANSACTIONS = gql`
  query getInitiatedTransactions($publicKey: String!) {
    getInitiatedTransactions(public_key: $publicKey) {
      id
      type
      source_acct
      description
      xdr_representation
      submitted
      hash
      signers {
        public_key
        signed
        signed_date
      }
    }
  }
`;

export const GET_TRANSACTIONS_TO_SIGN = gql`
  query getTransactionsToSign($publicKey: String!) {
    getTransactionsToSign(public_key: $publicKey) {
      id
      type
      source_acct
      description
      xdr_representation
      submitted
      hash
      signers {
        public_key
        signed
        signed_date
      }
    }
  }
`;

export const SIGN_TRANSACTION = gql`
  mutation signTransaction(
    $public_key: String!
    $passphrase: String!
    $transaction_id: String!
  ) {
    signTransaction(
      public_key: $public_key
      passphrase: $passphrase
      transaction_id: $transaction_id
    ) {
      id
      type
      source_acct
      description
      xdr_representation
      hash
      ledger
      submitted
      description
    }
  }
`;

export const GET_TRUSTEES_BY_ASSET = gql`
  query allTrustlines($assetCode: String!, $assetIssuer: String!) {
    allTrustlines(
      filter: {
        assetcode: { equalTo: $assetCode }
        issuer: { equalTo: $assetIssuer }
      }
    ) {
      nodes {
        accountid
        tlimit
      }
    }
  }
`;

export const CREATE_OFFER = gql`
  mutation createOffer(
    $publicKey: String!
    $sellAssetCode: String!
    $sellAssetIssuer: String
    $sellAmount: String!
    $buyAssetCode: String!
    $buyAssetIssuer: String
    $buyAmount: String!
  ) {
    createOffer(
      public_key: $publicKey
      sell_asset_code: $sellAssetCode
      sell_asset_issuer: $sellAssetIssuer
      sell_amount: $sellAmount
      buy_asset_code: $buyAssetCode
      buy_asset_issuer: $buyAssetIssuer
      buy_amount: $buyAmount
    ) {
      id
      type
      source_acct
      description
      submitted
    }
  }
`;

export const GET_ORDER_BOOK = gql`
  query getOrderBook(
    $sellAssetCode: String!
    $sellAssetIssuer: String
    $buyAssetCode: String!
    $buyAssetIssuer: String
  ) {
    getOrderbook(
      sell_asset_code: $sellAssetCode
      sell_asset_issuer: $sellAssetIssuer
      buy_asset_code: $buyAssetCode
      buy_asset_issuer: $buyAssetIssuer
    ) {
      bids {
        price
        amount
      }
      asks {
        price
        amount
      }
      base {
        asset_code
        asset_issuer
      }
      counter {
        asset_code
        asset_issuer
      }
    }
  }
`;

export const GET_OFFERS = gql`
  query getOffers($publicKey: String!) {
    getOffers(public_key: $publicKey) {
      id
      selling {
        asset_code
        asset_issuer
      }
      amount
      price
      buying {
        asset_code
        asset_issuer
      }
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation deleteOffer(
    $offerId: String!
    $publicKey: String!
    $sellAssetCode: String!
    $sellAssetIssuer: String!
    $buyAssetCode: String!
    $buyAssetIssuer: String
  ) {
    deleteOffer(
      public_key: $publicKey
      offer_id: $offerId
      sell_asset_code: $sellAssetCode
      sell_asset_issuer: $sellAssetIssuer
      buy_asset_code: $buyAssetCode
      buy_asset_issuer: $buyAssetIssuer
    ) {
      id
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation updateOffer(
    $publicKey: String!
    $offerId: String!
    $sellAssetCode: String!
    $sellAssetIssuer: String!
    $sellAmount: String!
    $buyAssetCode: String!
    $buyAssetIssuer: String!
    $buyAmount: String!
  ) {
    updateOffer(
      public_key: $publicKey
      offer_id: $offerId
      sell_asset_code: $sellAssetCode
      sell_asset_issuer: $sellAssetIssuer
      sell_amount: $sellAmount
      buy_asset_code: $buyAssetCode
      buy_asset_issuer: $buyAssetIssuer
      buy_amount: $buyAmount
    ) {
      id
      type
      submitted
      description
    }
  }
`;

export const GET_FEES = gql`
  query getFee($type: String!) {
    getFee(type: $type) {
      name
      description
      rate
      type
    }
  }
`;

export const SET_FLAG = gql`
  mutation setFlag(
    $publicKey: String!
    $flagOperations: String!
    $flagToSet: String!
  ) {
    createFlagTransaction(
      public_key: $publicKey
      flag_operation: $flagOperations
      flag_to_set: $flagToSet
    ) {
      id
      source_acct
    }
  }
`;

export const ALL_ASSETS = gql`
  query getAllAssets($publicKey: String!){
      getBalances(public_key: $publicKey){
          asset_code
          asset_issuer
          balance
      },
      getAssets{
          asset_code
          asset_issuer
      }
  }
`;
