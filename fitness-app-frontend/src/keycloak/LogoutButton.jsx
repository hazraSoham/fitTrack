import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import { logout } from './authSlice.js';

const LogoutButton = () => {
    const { logOut } = useContext(AuthContext);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        logOut();
    };

    return (
        <Button color="error" onClick={handleLogout}>Logout</Button>
    );
};

export default LogoutButton;
