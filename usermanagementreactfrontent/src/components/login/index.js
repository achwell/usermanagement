import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import {Button, Input, InputLabel} from "@material-ui/core";
import {withSnackbar} from "notistack";

import authenticationService from "../../service/autehentication.service";
import roleService from "../../service/role.service";
import userService from "../../service/user.service";

import './helptext.scss';

class LoginComponent extends Component {

    state = {username: '', password: ''}

    handleChange = event => {
        const value = event.target.value;
        if (value) {
            event.target.classList.add("used");
        } else {
            event.target.classList.remove("used");
        }
        this.setState({[event.target.name]: value});
    }

    loginClicked = () => {
        authenticationService.login({username: this.state.username, password: this.state.password})
            .then(response => {
                const token = response.headers["jwt-token"];
                authenticationService.saveToken(token);
                authenticationService.addUserToLocalCache(response.data);
                userService.getUsers()
                    .then(userResponse => {
                        userService.addUsersToLocalCache(userResponse.data);
                        roleService.loadRoles();
                        if (this.props.callBack) {
                            this.props.callBack(true);
                        }
                        this.props.history.push('/user/management');
                    }).catch(userError => this.handleError(userError));
            })
            .catch(e => this.handleError(e));
    }

    handleError(e) {
        let error = "";
        if (e.response) {
            error = e.response.data.message;
        } else if (e.message) {
            error = e.message;
        }
        this.props.enqueueSnackbar(error, {variant: 'error'});
    }

    render() {
        return (
            <>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>
                    <form style={{width: "100%"}} autoComplete="off">
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" name="username" type="text" required value={this.state.username}
                                   onChange={this.handleChange}/>
                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" name="password" type="password" required value={this.state.password}
                                   onChange={this.handleChange}/>
                        </FormControl>
                        <div>
                            <Button variant="outlined" color="primary" onClick={this.loginClicked}>Log in</Button>
                        </div>
                        <br/>
                        <div className="group">
                            Don't have an account?
                            <Link to="/register">Sign Up</Link>
                        </div>
                    </form>
                </div>
                <h2>Users</h2>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>
                    <table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Authorities</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>roleuser</td>
                            <td>password</td>
                            <td>USER</td>
                            <td>user:read</td>
                        </tr>
                        <tr>
                            <td>managerauthorities</td>
                            <td>password</td>
                            <td>MANAGER_AUTHORITIES</td>
                            <td>user:read, user:update</td>
                        </tr>
                        <tr>
                            <td>adminauthorities</td>
                            <td>password</td>
                            <td>ADMIN_AUTHORITIES</td>
                            <td>user:read, user:update, user:create, user:seelogintime, system:status</td>
                        </tr>
                        <tr>
                            <td>superadminauthorities</td>
                            <td>password</td>
                            <td>SUPER_ADMIN_AUTHORITIES</td>
                            <td>user:read, user:update, user:create, user:delete, user:seelogintime, system:status</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Authorities</h2>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>
                    <table>
                        <thead>
                        <tr>
                            <th>Authority</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>user:read</td>
                            <td>Can list users</td>
                        </tr>
                        <tr>
                            <td>user:update</td>
                            <td>Can update users</td>
                        </tr>
                        <tr>
                            <td>user:create</td>
                            <td>Can create users</td>
                        </tr>
                        <tr>
                            <td>user:delete</td>
                            <td>Can delete users</td>
                        </tr>
                        <tr>
                            <td>user:seelogintime</td>
                            <td>Can see registration- and last logintime in users table</td>
                        </tr>
                        <tr>
                            <td>system:status</td>
                            <td>Can see backend system status in toolbar</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Databaseconsole</h2>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>

                    <table>
                        <tbody>
                        <tr>
                            <td colSpan="2"><a target="_blank" rel="noreferrer"
                                               href="http://localhost:8081/h2-console">Databaseconsole</a></td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>sa</td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td>password</td>
                        </tr>
                        </tbody>

                    </table>
                </div>
            </>
        )
    }
}

LoginComponent.propTypes = {
    callBack: PropTypes.func
}

export default withRouter(withSnackbar(LoginComponent));