import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jsonwebtoken from 'jsonwebtoken';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            const token = localStorage.getItem('authToken');
            const loggedInUser = token ? jsonwebtoken.decode(token) : {};
            const dateNow = new Date();
            const curTime = dateNow.getTime();
            const content = (!!loggedInUser.email || (loggedInUser.exp < curTime / 1000)) ? <Component {...props} /> : <Redirect to="/login" />;
            return content;
        }}
    />
);

export default PrivateRoute;
