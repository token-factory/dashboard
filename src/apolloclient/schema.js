import gql from 'graphql-tag';

const typeDefs = gql`
  type Notification {
    __typename: String!
    message: String!
    kind: Int!
    popup: Boolean!
  }

  type FormEntry {
    label: String
  }

  type Query {
    getNotification: Notification
  }

  type Mutation {
    setNotification(
      title: String
      message: String
      popup: Boolean
      kind: Int
    ): Notification
  }
`;

export default typeDefs
