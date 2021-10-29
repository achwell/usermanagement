import React, {useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {AppBar, Toolbar} from "@mui/material";
import TypoGraphy from "@mui/material/Typography";
import Systemstatus from "./systemstatus";
import IconButton from "@mui/material/IconButton";
import {Add, Refresh} from "@mui/icons-material";
import authenticationService from "../service/autehentication.service";
import PropTypes from "prop-types";
import UserActions from "./useractions/useractions";
import {green, red} from "@mui/material/colors";

const PREFIX = 'TopMenu';

const classes = {
    root: `${PREFIX}-root`,
    h4: `${PREFIX}-h4`,
    ok: `${PREFIX}-ok`,
    error: `${PREFIX}-error`,
    caption: `${PREFIX}-caption`,
    button: `${PREFIX}-button`,
};

const red700 = red['700'];
const green600 = green['600'];

const Root = styled(AppBar)(({theme}) => ({
    [`& .${classes.root}`]: {
        flexGrow: 1,
        backgroundColor: "rgba(238,238,238, 1)"
    },
    [`& .${classes.h4}`]: {
        flexGrow: 1,
        color: "rgba(255, 255, 255, 0.87)"
    },
    [`& .${classes.ok}`]: {
        color: green600
    },

    [`& .${classes.error}`]: {
        color: red700
    },
    [`& .${classes.caption}`]: {
        flexGrow: 1,
        color: "rgba(255, 255, 255, 0.87)"
    },
    [`& .${classes.button}`]: {
        marginRight: theme.spacing(2),
    },
}));

function TopMenu({reload, changePassword, createUser, userProfile, setIsLoggedIn, isLoggedIn}) {

    const systemStatusComponentRef = useRef();

    const canCreate = authenticationService.hasAuthority("user:create");

    const [intervalID, setIntervalID] = useState(null);

    const updateSystemStatusComponent = () => systemStatusComponentRef.current.reloadData(false);

    function logout(isLoggedIn) {
        clearInterval(intervalID);
        setIsLoggedIn(isLoggedIn);
    }

    return (
        <Root position="static" className={classes.root} enableColorOnDark>
            <Toolbar>
                <TypoGraphy variant="h4" className={classes.h4}>
                    User Management Portal
                </TypoGraphy>
                <Systemstatus ref={systemStatusComponentRef} classes={classes} setIntervalID={setIntervalID}
                              intervalID={intervalID}/>
                {canCreate && <IconButton
                    edge="start"
                    className={classes.button}
                    color="secondary"
                    aria-label="Create User"
                    title="Create User"
                    onClick={createUser}
                    size="large">
                    <Add/>
                </IconButton>
                }
                {isLoggedIn && <IconButton
                    edge="start"
                    className={classes.button}
                    color="secondary"
                    aria-label="Reload users"
                    title="Reload users"
                    onClick={() => {
                        reload();
                        updateSystemStatusComponent();
                    }}
                    size="large">
                    <Refresh/>
                </IconButton>
                }
                <UserActions isLoggedIn={isLoggedIn} logOutAction={logout} profileAction={userProfile}
                             changePasswordAction={changePassword}/>

            </Toolbar>
        </Root>
    );
}

TopMenu.propTypes = {
    reload: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    userProfile: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    setIsLoggedIn: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
}

export default TopMenu;