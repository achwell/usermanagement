import React, {Component, createRef} from 'react';
import {Link, withRouter} from "react-router-dom";
import authenticationService from "../../service/autehentication.service";
import TextElement from "../form/input/TextElement";
import {Button} from "@mui/material";
import {withSnackbar} from "notistack";
import Form from "../form/form";

const INITIAL_STATE = {
    user: {
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: Math.random().toString(16).substr(2, 8),
        role: {id: -1, name: 'UNKNOWN'}
    },
    disabled: true
};

class RegisterComponent extends Component {

    state = INITIAL_STATE;
    form = createRef();

    handleChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        user[name] = event.target.value;
        this.form.current.isFormValid(false);
        this.setState({user});
    }

    registerClicked = () => {
        authenticationService.register(this.state.user)
            .then(response => {
                const message = `A new account was created for ${response.data.firstName}. Please check your email for password to log in.`;
                this.props.enqueueSnackbar(message, {variant: 'success'});
                this.setState(INITIAL_STATE);
                this.props.history.push("/login");
            })
            .catch(e => {
                let error = "";
                if (e.response && e.response.data) {
                    error = e.response.data.message;
                } else if (e.message) {
                    error = e.message;
                }
                this.props.enqueueSnackbar(error, {variant: 'error'});
                if(e.response.status === 400) {
                    try {
                        const jsonObject = JSON.parse(error);
                        let {formErrors, fieldErrors} = this.state;
                        Object.keys(jsonObject).forEach(function(key) {
                            const value = jsonObject[key];
                            fieldErrors[key] = true;
                            formErrors[key] = value;
                        });
                        this.setState({formErrors, fieldErrors})
                    } catch (e) {}
                }
                this.props.history.push("/login");
            })
    }

    validatorListener = (result) => {
        this.setState({disabled: !result});
    }

    render() {
        if (authenticationService.isLoggedIn()) {
            this.props.history.push("/user/management");
        }
        const {user} = this.state;
        return (
            <Form onSubmit={this.registerClicked} ref={this.form}>
                <TextElement
                    label="Username"
                    onChange={this.handleChange}
                    name="username"
                    value={user.username}
                    required
                    readOnly={false}
                    validators={['required', 'minStringLength:7', 'matchRegexp:^[a-z0-9]{7,}$']}
                    errorMessages={['Usernamed is required', 'Username must be 7 or more characters', 'Username contains illegal characters']}
                    validatorListener={this.validatorListener}/>
                <TextElement
                    label="First name"
                    onChange={this.handleChange}
                    name="firstName"
                    value={user.firstName}
                    required
                    readOnly={false}
                    validators={['required']}
                    errorMessages={['First name is required']}
                    validatorListener={this.validatorListener}/>
                <TextElement
                    label="Middle name"
                    onChange={this.handleChange}
                    name="middleName"
                    value={user.middleName}
                    readOnly={false}
                    validators={[]}
                    errorMessages={[]}
                    validatorListener={this.validatorListener}/>
                <TextElement
                    label="Last name"
                    onChange={this.handleChange}
                    name="lastName"
                    value={user.lastName}
                    required
                    readOnly={false}
                    validators={['required']}
                    errorMessages={['Last name is required']}
                    validatorListener={this.validatorListener}/>
                <TextElement
                    label="Email"
                    onChange={this.handleChange}
                    name="email"
                    value={user.email}
                    required
                    readOnly={false}
                    validators={['required', 'isEmail']}
                    errorMessages={['Email is required', 'Email is not valid']}
                    validatorListener={this.validatorListener}/>
                <TextElement
                    label="Phone"
                    onChange={this.handleChange}
                    name="phone"
                    value={user.phone}
                    required
                    readOnly={false}
                    validators={['required']}
                    errorMessages={['Phone is required']}
                    validatorListener={this.validatorListener}/>
                <div>
                    <Button variant="outlined" type="submit" disabled={this.state.disabled}>Register</Button>
                </div>
                <div className="group">
                    Already have an account?
                    <Link to="/login">Log In</Link>
                </div>
            </Form>
        );
    }
}

export default withSnackbar(withRouter(RegisterComponent));