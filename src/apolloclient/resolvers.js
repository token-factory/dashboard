import gql from 'graphql-tag';

const NOTIFICATION = gql`
  query {
    notificationStatus @client {
      title
      message
      kind
      popup
      withoutHeader
    }
  }
`;

const resolvers = {
    Query: {
        getNotification: (_, args, { cache }) => {
            const notification = cache.readQuery({ query: NOTIFICATION });
            return notification.notificationStatus;
        }
    },

    Mutation: {
        setNotification: (_, args, { cache }) => {
            const data = {
                notificationStatus: {
                    __typename: 'Notification',
                    title: args.title,
                    message: args.message,
                    kind: args.kind,
                    popup: args.popup,
                    withoutHeader: args.withoutHeader
                }
            };
            cache.writeQuery({ query: NOTIFICATION, data: data });
            return null;
        }
    }
};

export default resolvers;
