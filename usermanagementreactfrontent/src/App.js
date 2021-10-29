import React, {useRef, useState} from 'react';

import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import LoginComponent from "./components/login";
import RegisterComponent from "./components/register";
import UserComponent from "./components/user";
import TopMenu from "./components/TopMenu";
import {createTheme, responsiveFontSizes, ThemeProvider} from "@mui/material/styles";
import {adaptV4Theme, StyledEngineProvider} from "@mui/material";
import authenticationService from "./service/autehentication.service";

let theme = createTheme(adaptV4Theme({
    palette: {
        mode: "light",
        primary: {
            main: "rgba(0, 0, 0, 0.87)"
        },
        secondary: {
            main: "rgba(255, 255, 255, 0.87)"
        }
    },
    props: {
        MuiFormControl: {
            variant: 'standard',
        },
        MuiSelect: {
            variant: 'standard',
        },
        MuiTextField: {
            variant: 'standard',
        },
        MuiLink: {
            underline: 'hover',
        },
    },
}));
theme = responsiveFontSizes(theme);

function App() {
    const userComponentRef = useRef();

    const reload = () => userComponentRef.current.reload();
    const createUser = () => userComponentRef.current.create();
    const userProfile = () => userComponentRef.current.userProfile();
    const changePassword = () => userComponentRef.current.changePassword();
    const [isLoggedIn, setIsLoggedIn] = useState(authenticationService.isLoggedIn());

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Router>
                    <TopMenu
                        reload={reload}
                        changePassword={changePassword}
                        createUser={createUser}
                        userProfile={userProfile}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}/>
                    <Switch>
                        <Route exact path="/login">
                            {isLoggedIn ? <Redirect to="/user/management"/> :
                                <LoginComponent callBack={setIsLoggedIn}/>}
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
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
