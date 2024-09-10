import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    return (
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
                <li>
                    <Link to="/" style={{ color: location.pathname === '/' ? 'yellow' : 'white', textDecoration: 'none' }}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/highscores" style={{ color: location.pathname === '/highscores' ? 'yellow' : 'white', textDecoration: 'none' }}>
                        High Scores
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;