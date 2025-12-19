import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🗳️ Voting App
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link
                            to="/polls"
                            className={`nav-link ${location.pathname === '/polls' || location.pathname === '/' ? 'active' : ''}`}
                        >
                            All Polls
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/create"
                            className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
                        >
                            Create Poll
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;