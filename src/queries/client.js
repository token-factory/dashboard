import gql from 'graphql-tag';

export const SET_NOTIFICATION = gql`
  mutation setNotification(
    $title: String!
    $message: String!
    $popup: Boolean!
    $kind: Int!
    $withoutHeader: Boolean!
  ) {
    setNotification(
      title: $title
      message: $message
      popup: $popup
      kind: $kind
      withoutHeader: $withoutHeader
    ) @client {
      title
      message
      popup
      kind
      withoutHeader
    }
  }
`;

export const GET_NOTIFICATION = gql`
  query {
    getNotification @client {
      title
      message
      popup
      kind
      withoutHeader
    }
  }
`;

export const GET_MODAL = gql`
  query {
    getModal @client {
      title
      message
      popup
      kind
      primaryButtonText
      secondaryButtonText
      formEntry
      mutationString
      refetchString
      refetchVariable
      noSign
    }
  }
`;
