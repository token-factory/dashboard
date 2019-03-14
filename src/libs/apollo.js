import { apolloClient } from '../apolloclient/apolloClient';

import { SET_NOTIFICATION, GET_NOTIFICATION } from '../queries/client';
import { SIGN_TRANSACTION } from '../queries/account';

export async function handleError(error, errorTitle, errorMessage, withoutHeader) {
    await apolloClient.mutate({
        mutation: SET_NOTIFICATION,
        variables: {
            title: errorTitle,
            message: errorMessage,
            kind: 3,
            popup: true,
            withoutHeader: withoutHeader ? withoutHeader : false
        },
        refetchQueries: [{ query: GET_NOTIFICATION }]
    });
}

export async function handleSuccess(successTitle, successMessage, withoutHeader) {
    await apolloClient.mutate({
        mutation: SET_NOTIFICATION,
        variables: {
            title: successTitle,
            message: successMessage,
            kind: 1,
            popup: true,
            withoutHeader: withoutHeader ? withoutHeader : false
        },
        refetchQueries: [{ query: GET_NOTIFICATION }]
    });
}

export async function handleReset() {
    await apolloClient.mutate({
        mutation: SET_NOTIFICATION,
        variables: {
            title: '',
            message: '',
            kind: 0,
            popup: false,
            withoutHeader: false
        },
        refetchQueries: [{ query: GET_NOTIFICATION }]
    });
}

/** Perform GQL Mutation call with refetch */
export async function apolloMutation(mutation, variables, refetchQueries) {
    try {
        const response = await apolloClient.mutate({
            mutation: mutation,
            variables: variables,
            refetchQueries: refetchQueries ? refetchQueries : []
        });
        if (response.errors) {
            const errorMessage = response.errors[0].message;
            await handleError(response.errors, 'Mutation error', errorMessage);
            throw new Error(errorMessage);
        }
        return response;
    } catch (error) {
        await handleError(error, 'Network error', error.message);
        throw new Error(error.message);
    }
}

/** Perform GQL Query call */
export async function apolloQuery(query, variables) {
    try {
        const response = await apolloClient.query({
            query: query,
            variables: variables
        });
        if (response.errors) {
            const errorMessage = response.errors[0].message;
            await handleError(response.errors, 'Query error', errorMessage);
            throw new Error(errorMessage);
        }
        return response;
    } catch (error) {
        await handleError(error, 'Query error', error.message);
        throw new Error(error.message);
    }
}

export async function apolloSignTransaction(
    public_key,
    transactionId,
    passphrase,
    refetchQueries
) {
    try {
        const response = await apolloClient.mutate({
            mutation: SIGN_TRANSACTION,
            variables: {
                public_key: public_key,
                transaction_id: transactionId,
                passphrase: passphrase
            },
            refetchQueries: refetchQueries ? refetchQueries : []
        });
        if (response.errors) {
            const errorMessage = response.errors[0].message;
            await handleError(response.errors, 'Mutation error', errorMessage);
            throw new Error(errorMessage);
        }
        return response;
    } catch (error) {
        await handleError(error, 'Network error', error.message);
        throw new Error(error.message);
    }
}
