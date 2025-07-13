import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../../frontend/src/Login';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('fendi-login-root');
    if (root) {
        ReactDOM.render(<Login />, root);
    }
});
