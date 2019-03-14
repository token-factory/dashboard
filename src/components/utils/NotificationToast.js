import React, { Component } from 'react';
import { ToastNotification } from 'carbon-components-react';
import { GET_NOTIFICATION, SET_NOTIFICATION } from '../../queries/client';
import { compose, graphql } from 'react-apollo';
import Transition from 'react-transition-group/Transition';
import '../../style/scss/notification.scss';

const duration = 300;

const NOTIFICATION_DATA = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: 'error'
};

const defaultStyle = {
    transition: `right ${duration}ms ease-in-out`
};

const transitionStyles = {
    entering: {
        right: '-100%'
    },
    entered: {
        right: '0'
    }
};

class NotificationToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toast: false,
            notificationData: null
        };
        this.closeNotification = this.closeNotification.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { GET_NOTIFICATION } = props;
        const { notificationData } = state;
        if (GET_NOTIFICATION.getNotification !== notificationData) {
            return {
                notificationData: GET_NOTIFICATION.getNotification,
                toast: !!GET_NOTIFICATION.getNotification && GET_NOTIFICATION.getNotification.popup
            }
        }
        return null;
    }

    async closeNotification() {
        await this.props.SET_NOTIFICATION({
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

    async closeTimer(time) {
        setTimeout(() => {
            this.closeNotification();
        }, time * 1000);
    }

    render() {
        const { GET_NOTIFICATION } = this.props;
        const { getNotification } = GET_NOTIFICATION;
        const { toast } = this.state;
        if (toast) {
            this.closeTimer(getNotification.kind < 2 ? 5 : 10)
            return (
                <Transition in={toast} timeout={duration} unmountOnExit>
                    {(state) => (
                        <ToastNotification
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state]
                            }}
                            className={`toast${getNotification.withoutHeader ? ' no-header' : ''}`}
                            title={getNotification.title}
                            kind={NOTIFICATION_DATA[getNotification.kind]}
                            subtitle={getNotification.message}
                            onCloseButtonClick={() => this.closeNotification()}
                            caption={new Date().toString()}
                        />
                    )}
                </Transition>
            )
        }
        return null;
    }
}

export default compose(
    graphql(GET_NOTIFICATION, { name: 'GET_NOTIFICATION' }),
    graphql(SET_NOTIFICATION, { name: 'SET_NOTIFICATION' })
)(NotificationToast);
