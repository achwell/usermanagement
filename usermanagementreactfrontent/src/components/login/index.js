import React, {Component, createRef} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import TextElement from "../form/input/TextElement";
import {Button} from "@material-ui/core";
import {withSnackbar} from "notistack";

import authenticationService from "../../service/autehentication.service";
import roleService from "../../service/role.service";
import userService from "../../service/user.service";

import './helptext.scss';
import Form from "../form/form";
import ResetPassword from "./resetpassword";

class LoginComponent extends Component {

    state = {formData: {username: '', password: '', email: '', resetPasswordOpen: false, resetPasswordSubmitReadOnly: true}}
    form = createRef()
    resetPasswordFormRef = createRef()

    baseUrl = process.env.REACT_APP_BACKEND_BASE_URL ? process.env.REACT_APP_BACKEND_BASE_URL : window.location.origin;

    handleChange = event => {
        const {formData} = this.state;
        const name = event.target.name;
        formData[name] = event.target.value;
        this.form.current.isFormValid(false);
        this.setState({formData});
    }

    loginClicked = () => {
        const {username, password} = this.state.formData;
        authenticationService.login({username, password})
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

    setResetPasswordSubmitReadOnly = resetPasswordSubmitReadOnly => {
        this.setState({resetPasswordSubmitReadOnly});
    };

    doResetPassword = () => {
        const email = this.resetPasswordFormRef.current.submit();
        userService.resetPassword(email);
        this.setState({resetPasswordOpen: false, resetPasswordSubmitReadOnly: true, email: ''});
    }


    render() {
        const {formData} = this.state;
        return (
            <>
                <Form onSubmit={this.loginClicked} ref={this.form}>
                    <TextElement
                        label="Username"
                        onChange={this.handleChange}
                        name="username"
                        value={formData.username}
                        required
                        validators={['required']}
                        errorMessages={['Username is required']}
                        validatorListener={this.validatorListener}/>
                    <TextElement
                        label="Password"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        value={formData.password}
                        validators={['required']}
                        errorMessages={['Password is required']}
                        validatorListener={this.validatorListener}/>
                    <div>
                        <Button variant="outlined" color="primary" type="submit">Log in</Button>
                    </div>
                    <br/>
                    <div className="group">
                        Don't have an account?  <Link to="/register"><strong>Sign Up</strong></Link>
                    </div>
                    <br/>
                    <div className="group">
                        Forgotten Password?  <a onClick={() => this.setState({resetPasswordOpen: true})}><strong>Reset Password.</strong></a>
                    </div>
                </Form>
                <ResetPassword
                    ref={this.resetPasswordFormRef}
                    readOnly={false}
                    submitReadOnly={this.state.resetPasswordSubmitReadOnly}
                    setSubmitReadOnly={this.setResetPasswordSubmitReadOnly}
                    isOpen={this.state.resetPasswordOpen}
                    title="Reset Password"
                    submitTitle="Reset Password"
                    onSubmit={this.doResetPassword}
                    handleClose={() => this.setState({resetPasswordOpen: false})}
                />
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
                            <td>user:read, role:read</td>
                        </tr>
                        <tr>
                            <td>managerauthorities</td>
                            <td>password</td>
                            <td>MANAGER_AUTHORITIES</td>
                            <td>user:read, user:update, role:read</td>
                        </tr>
                        <tr>
                            <td>adminauthorities</td>
                            <td>password</td>
                            <td>ADMIN_AUTHORITIES</td>
                            <td>user:read, user:update, user:create, user:seelogintime, role:read, system:status</td>
                        </tr>
                        <tr>
                            <td>superadminauthorities</td>
                            <td>password</td>
                            <td>SUPER_ADMIN_AUTHORITIES</td>
                            <td>user:read, user:update, user:create, user:delete, user:seelogintime, role:read, system:status</td>
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
                <h2>Profiles</h2>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>

                    <table>
                        <thead>
                        <tr>
                            <th>profile</th>
                            <th>database</th>
                            <th>h2-console available</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>&nbsp;</td>
                            <td>h2</td>
                            <td>yes</td>
                        </tr>
                        <tr>
                            <td>derby</td>
                            <td>Embedded derby</td>
                            <td>no</td>
                        </tr>
                        <tr>
                            <td>mysql</td>
                            <td>mysql</td>
                            <td>no</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Tools</h2>
                <div style={{display: "flex", justifyContent: "center", margin: 20, padding: 20}}>

                    <table>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Username</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><a target="_blank" rel="noreferrer" href={`${this.baseUrl}/h2-console`}>Databaseconsole</a></td>
                            <td>sa</td>
                            <td>password</td>
                        </tr>
                        <tr>
                            <td><a target="_blank" rel="noreferrer" href={`${this.baseUrl}/swagger-ui.html`}>Swagger</a></td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><a target="_blank" rel="noreferrer" href={`${this.baseUrl}/actuator`}>Actuator</a></td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
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