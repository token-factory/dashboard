import React, { Component, createRef } from 'react';
import '../../style/scss/topbar.scss';
import { Link, withRouter } from 'react-router-dom';
import LogoutButton from '../registration/LogoutButton';
import { Icon } from 'carbon-components-react';
import jsonwebtoken from 'jsonwebtoken';

const UNAUTHENTICATED_ROUTES = ['/login', '/signup', '/resetPassword'];

class Topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDropdownOpen: false
        };
        this.headerWrapper = createRef();
        this.changePasswordRef = createRef();
        this.appMenuRef = createRef();
    }
    componentDidMount() {
        document.addEventListener('click', evt => {
            const checkbox = document.getElementById('hamburgerBtn');
            const navbar = document.getElementById('navigationBar');
            const targetElement = evt.target;

            if (targetElement === checkbox || targetElement === navbar) {
                return;
            }

            if (checkbox) {
                checkbox.checked = false;
            }
        });
    }

    handleMouseClick(event) {
        const headerWrapperNode = this.headerWrapper && this.headerWrapper.current;
        const changePasswordNode = this.changePasswordRef && this.changePasswordRef.current;
        const appMenuNode = this.appMenuRef && this.appMenuRef.current;
        const targetNode = event && event.target;
        if (targetNode
            && ((headerWrapperNode && !headerWrapperNode.contains(targetNode))
            || (changePasswordNode && changePasswordNode.contains(targetNode))
            || (appMenuNode && appMenuNode.contains(targetNode))
            || (!headerWrapperNode))) {
            this.setState({
                userDropdownOpen: false
            });
            document.removeEventListener('click', this.handleMouseClick.bind(this));
        }
    }

    handleUserDropdownClick() {
        this.setState({
            userDropdownOpen: !this.state.userDropdownOpen
        }, () => {
            if (this.state.userDropdownOpen) {
                document.addEventListener('click', this.handleMouseClick.bind(this));
            } else {
                document.removeEventListener('click', this.handleMouseClick.bind(this));
            }
        });
    }

    render() {
        const { location } = this.props;
        const { userDropdownOpen } = this.state;
        const token = localStorage.getItem('authToken');
        const loggedInUser = token ? jsonwebtoken.decode(token) : {};

        // Don't render header on unauthenticated routes
        if (UNAUTHENTICATED_ROUTES.includes(location.pathname)) {
            return null;
        }

        const dropDownMenuContent = (
            <ul className="dropdown-content">
                <li className="dropdown-list dropdown-user-profile" title={loggedInUser.email}>
                    <Icon name={'icon--user'} />
                    <div>{loggedInUser.email}</div>
                </li>
                <li className="dropdown-list" title="Change password" ref={this.changePasswordRef}>
                    <Link to="/changepassword">
                        Change password
                    </Link>
                </li>
                <li className="dropdown-list" title="Logout">
                    <LogoutButton />
                </li>
            </ul>
        );

        const leftNavMenuContent = (
            <nav className="bx--cloud-header__navigation-bar" id="navigationBar">
                <ul className="nav">
                    <li className="nav-item">
                        <a href="#/dashboard" className="nav-item-link">
                            <Icon name={'icon--dashboard'} />
                            Dashboard
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#/accounts" className="nav-item-link">
                            <Icon name={'icon--pa'} />
                            Accounts
                        </a>
                    </li>
                </ul>
            </nav>
        );

        const headerContent = (
            <nav className="bx--cloud-header" ref={this.headerWrapper}>
                <div className="bx--cloud-header__wrapper">
                    <div className="bx--cloud-header__app-menu" ref={this.appMenuRef}>
                        <input type="checkbox" id="hamburgerBtn" />
                        <Icon name={'icon--header--hamburger'} width='20' className="bx--cloud-header__app-menu__expand" fill="#xwfff" />
                        <Icon name={'icon--header--close'} width='20' className="bx--cloud-header__app-menu__collapse" fill="#152935" />
                        {leftNavMenuContent}
                    </div>
                    <a href="" className="bx--cloud-header-brand">
                        <h4 className="bx--cloud-header-brand__text">
                            Token<span>Factory</span>
                        </h4>
                    </a>
                </div>
                <div className="bx--cloud-header__wrapper">
                    <ul className="bx--cloud-header-list">
                        <li className="bx--cloud-header-list__item bx--cloud-header-list__item--icon">
                            <span>{loggedInUser.email}</span>
                        </li>
                        <li className="bx--cloud-header-list__item bx--cloud-header-list__item--icon">
                            <button type="button" className='bx--cloud-header-list__btn' onClick={() => this.handleUserDropdownClick()}>
                                <Icon name={'icon--user'} width={'3rem'} height={'3rem'} fill={'#fff'} />
                            </button>
                            {userDropdownOpen && dropDownMenuContent}
                        </li>
                    </ul>
                </div>
            </nav>
        );
        return headerContent;
    }
}

export default withRouter(Topbar);
