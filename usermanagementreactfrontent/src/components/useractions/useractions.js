import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";

import PropTypes from 'prop-types';

import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Portrait from '@mui/icons-material/Portrait';

import authenticationService from "../../service/autehentication.service";
import {IconButton} from "@mui/material";

function UserActions(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => setIsLoggedIn(props.isLoggedIn), [props]);

    const history = useHistory();

    const {logOutAction, profileAction, changePasswordAction} = props;

    const location = useLocation();

    const doLogout = () => {
        authenticationService.logout();
        setIsLoggedIn(false);
        logOutAction(false);
        history.push("/login");
    };

    const doLogin = () => {
        history.push("/login");
    }

    const doProfileAction = () => {
        setAnchorEl(null);
        profileAction();
    };

    const doChangePasswordAction = () => {
        setAnchorEl(null);
        changePasswordAction();
    }

    if(!isLoggedIn) {
        return location.pathname.endsWith("/login") ? null : <Button variant="outlined" onClick={doLogin}>Log in</Button>;
    }
    const currentUser = authenticationService.getUserFromLocalCache();
    let currentUserName = currentUser.firstName;
    if(currentUser.middleName) {
        currentUserName += " " + currentUser.middleName;
    }
    currentUserName += " " + currentUser.lastName;

    return (
        <div>
            <IconButton size="large" edge="start" aria-controls="simple-menu" color="secondary" aria-haspopup="true" onClick={handleClick} title={currentUserName}>
                <Portrait/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem><strong>{currentUserName}</strong></MenuItem>
                <MenuItem onClick={doProfileAction}>My account</MenuItem>
                <MenuItem onClick={doChangePasswordAction}>Change password</MenuItem>
                <MenuItem onClick={doLogout}>Log Out</MenuItem>
            </Menu>
        </div>
    );
}

UserActions.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    logOutAction: PropTypes.func.isRequired,
    profileAction: PropTypes.func.isRequired,
    changePasswordAction: PropTypes.func.isRequired
}

export default UserActions;