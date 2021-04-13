import React, {useRef, useState} from 'react';

import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import Toolbar from '@material-ui/core/Toolbar'
import TypoGraphy from '@material-ui/core/Typography'

import authenticationService from "./service/autehentication.service";

import LoginComponent from "./components/login";
import RegisterComponent from "./components/register";
import UserComponent from "./components/user";
import UserActions from "./components/useractions/useractions";
import Systemstatus from "./components/systemstatus";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#eee"
    },
    button: {
        marginRight: theme.spacing(2),
    },
    h4: {
        flexGrow: 1,
        color: "rgba(0, 0, 0, 0.87)"
    },
    caption: {
        flexGrow: 1,
        color: "rgba(0, 0, 0, 0.87)"
    },
    error: {
        color: "rgba(255, 0, 0, 1)"
    }
}));

function App() {

    const classes = useStyles();
    const canCreate = authenticationService.hasAuthority("user:create");

    const userComponentRef = useRef();
    const systemStatusComponentRef = useRef();

    const [isLoggedIn, setIsLoggedIn] = useState(authenticationService.isLoggedIn());
    const [intervalID, setIntervalID] = useState(null);

    const userProfile = () => userComponentRef.current.userProfile();
    const changePassword = () => userComponentRef.current.changePassword();

    const updateSystemStatusComponent = () => systemStatusComponentRef.current.reloadData(false);

    function logout(isLoggedIn) {
        clearInterval(intervalID);
        setIsLoggedIn(isLoggedIn);
    }

    return (
        <Router>
            <AppBar position="static" className={classes.root}>
                <Toolbar>
                    <TypoGraphy variant="h4" className={classes.h4}>
                        User Management Portal
                    </TypoGraphy>
                    <Systemstatus ref={systemStatusComponentRef} classes={classes} setIntervalID={setIntervalID} intervalID={intervalID}/>
                    {canCreate && <IconButton
                        edge="start"
                        className={classes.button}
                        color="primary"
                        aria-label="Create User"
                        onClick={() => userComponentRef.current.create()}
                    >
                        <AddIcon/>
                    </IconButton>
                    }
                    {isLoggedIn && <IconButton
                        edge="start"
                        className={classes.button}
                        color="primary"
                        aria-label="Reload"
                        onClick={() => {
                            userComponentRef.current.reload();
                            updateSystemStatusComponent();
                        }}
                    >
                        <RefreshIcon/>
                    </IconButton>
                    }
                    <UserActions isLoggedIn={isLoggedIn} logOutAction={logout} profileAction={userProfile} changePasswordAction={changePassword}/>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/login">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <LoginComponent callBack={setIsLoggedIn}/>}
                </Route>
                <Route exact path="/register">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <RegisterComponent/>}
                </Route>
                <Route exact path="/user/management">
                    {isLoggedIn ? <UserComponent ref={userComponentRef}/> : <Redirect to="/login"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn ? <Redirect to="/user/management"/> : <Redirect to="/login"/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
