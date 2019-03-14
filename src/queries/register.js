import gql from 'graphql-tag';

export const ME = gql`
  query {
    me {
      id
      tenantId
      email
    }
  }
`;

export const LIST_TENANTS = gql`
  query {
    listTenants {
      id
      name
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($tenantId: String!, $email: String!, $password: String!) {
    createUser(tenantId: $tenantId, email: $email, password: $password) {
      id
      email
      tenantId
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($email: String!) {
    deleteUser(email: $email) {
      id
      email
      tenantId
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      authToken
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $email: String!
    $currentpassword: String!
    $newpassword: String!
  ) {
    changePassword(
      email: $email
      currentpassword: $currentpassword
      newpassword: $newpassword
    ) {
      id
      email
      tenantId
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email) {
      id
      email
      tenantId
    }
  }
`;

export const CREATE_TENANT = gql`
  mutation createTenant($name: String!) {
    createTenant(name: $name) {
      id
      name
    }
  }
`;

export const DELETE_TENANT = gql`
  mutation deleteTenant($name: String!) {
    deleteTenant(name: $name) {
      id
      name
    }
  }
`;
