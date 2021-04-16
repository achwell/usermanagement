import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuItem from '@material-ui/core/MenuItem';
import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import {Textinput} from "../form/input/textinput";
import {Checkboxinput} from "../form/input/checkboxinput";
import {Selectinput} from "../form/input/selectinput";
import {Formcomponent} from "../form";


class UserForm extends Component {

    state = {
        user: this.props.initialValues,
        roles: roleService.getRoles(),
        formErrors: {username: '', firstName: '', lastName: '', email: '', phone: ''},
        fieldErrors: {username: true, firstName: true, lastName: true, email: true, phone: true},
        formValid: false
    }

    isEditProfile = () => this.props.currentUserId === this.state.user.id

    componentDidMount() {
        if (this.state.user.id) {
            this.validateField('username', this.state.user.username);
            this.validateField('firstName', this.state.user.firstName);
            this.validateField('lastName', this.state.user.lastName);
            this.validateField('email', this.state.user.email);
            this.validateField('phone', this.state.user.phone);
        }
    }

    handleInputChange = e => {
        if (!this.props.readOnly) {
            const name = e.target.name;
            const value = e.target.value;
            this.setState({user: {...this.state.user, [name]: value}});
            this.validateField(name, value, e)
        }
    }
    handleCheckboxChange = e => {
        if (!this.props.readOnly && !this.isEditProfile()) {
            const name = e.target.name;
            const checked = e.target.checked;
            this.setState({user: {...this.state.user, [name]: checked}});
            this.validateField(name, checked, e);
        }
    }
    handleRoleInputChange = e => {
        if (!this.props.readOnly && !this.isEditProfile()) {
            const name = e.target.name;
            const roleId = e.target.value;
            const role = this.state.roles.filter(role => role.id === roleId)[0];
            this.setState({user: {...this.state.user, role, roleId}});
            this.validateField(name, roleId, e)
        }

    }

    validateField(fieldName, value, e) {
        const {formErrors, fieldErrors} = this.state;

        let usernameValid = !fieldErrors.username;
        let firstNameValid = !fieldErrors.firstName;
        let lastNameValid = !fieldErrors.lastName;
        let emailValid = !fieldErrors.email;
        let phoneValid = !fieldErrors.phone;

        let fieldValidated = true;

        switch (fieldName) {
            case 'username':
                usernameValid = value.match(/^[a-z0-9]{7,}$/i);
                formErrors.username = usernameValid ? '' : (value && value.length > 6) ? ' contains illegal characters' : ' is too short';
                fieldErrors.username = !usernameValid;
                if (e) {
                    usernameValid ? e.target.classList.remove('error') : e.target.classList.add('error');
                }
                break;
            case 'firstName':
                firstNameValid = value.length >= 1;
                formErrors.firstName = firstNameValid ? '' : ' is required';
                fieldErrors.firstName = !firstNameValid;
                if (e) {
                    firstNameValid ? e.target.classList.remove('error') : e.target.classList.add('error');
                }
                break;
            case 'lastName':
                lastNameValid = value.length >= 1;
                formErrors.lastName = lastNameValid ? '' : ' is required';
                fieldErrors.lastName = !lastNameValid;
                if (e) {
                    lastNameValid ? e.target.classList.remove('error') : e.target.classList.add('error');
                }
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                formErrors.email = emailValid ? '' : ' is invalid';
                fieldErrors.email = !emailValid;
                if (e) {
                    emailValid ? e.target.classList.remove('error') : e.target.classList.add('error');
                }
                break;
            case 'phone':
                phoneValid = value.length >= 8;
                formErrors.phone = phoneValid ? '' : ' is too short';
                fieldErrors.phone = !phoneValid;
                if (e) {
                    phoneValid ? e.target.classList.remove('error') : e.target.classList.add('error');
                }
                break;
            default:
                fieldValidated = false;
                break;
        }
        if (fieldValidated) {
            this.setState({formErrors, fieldErrors})
            this.validateForm();
        }
    }

    validateForm = () => {
        const {username, firstName, lastName, email, phone} = this.state.fieldErrors;
        const formValid = !username && !firstName && !lastName && !email && !phone;
        this.setState({formValid});
        this.props.setValidationErrors(formValid);
    }

    save = () => {
        const user = _.omit(this.state.user, 'roleId');
        this.props.onSubmit(user);
    }

    getRoles = () => {
        return this.state.roles.sort((a, b) => a.id - b.id).map(role => <MenuItem
            key={role.id}
            value={role.id}>{role.name.replace(/^(ROLE_)/, "")}</MenuItem>);
    };

    render() {
        const {readOnly} = this.props;
        const {user, formErrors, fieldErrors} = this.state;

        if (!user) {
            return null;
        }
        return (
            <Formcomponent formErrors={formErrors}>
                <Textinput id="username" label="Username" value={user.username} required
                           readOnly={readOnly || !!this.state.user.id} onChange={this.handleInputChange}
                           hasError={fieldErrors.username} errorMessage={formErrors.username}/>
                <Textinput id="firstName" label="First name" value={user.firstName} required readOnly={readOnly}
                           onChange={this.handleInputChange} hasError={fieldErrors.firstName}
                           errorMessage={formErrors.firstName}/>
                <Textinput id="middleName" label="Middle name" value={user.middleName} readOnly={readOnly}
                           onChange={this.handleInputChange} hasError={false}/>
                <Textinput id="lastName" label="Last name" value={user.lastName} required readOnly={readOnly}
                           onChange={this.handleInputChange} hasError={fieldErrors.lastName}
                           errorMessage={formErrors.lastName}/>
                <Textinput id="email" type="email" label="Email" value={user.email} required readOnly={readOnly}
                           onChange={this.handleInputChange} hasError={fieldErrors.email}
                           errorMessage={formErrors.email}/>
                <Textinput id="phone" label="Phone" value={user.phone} required readOnly={readOnly}
                           onChange={this.handleInputChange} hasError={fieldErrors.phone}
                           errorMessage={formErrors.phone}/>
                <Checkboxinput id="active" label="Active" checked={user.active}
                               readOnly={readOnly || this.isEditProfile()} onChange={this.handleCheckboxChange}/>
                <Checkboxinput id="notLocked" label="Not Locked" checked={user.notLocked}
                               readOnly={readOnly || this.isEditProfile()} onChange={this.handleCheckboxChange}/>
                <Selectinput id="role" label="Role" value={user.roleId} options={this.getRoles()}
                             readOnly={readOnly || this.isEditProfile()} onChange={this.handleRoleInputChange}/>
            </Formcomponent>
        );
    }
}

UserForm.propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    setValidationErrors: PropTypes.func,
    currentUserId: PropTypes.number
};
UserForm.defaultProps = {
    initialValues: {},
    onSubmit: () => {},
    readOnly: false,
    setValidationErrors: () => {}
};

export default withSnackbar(UserForm);
