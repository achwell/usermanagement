import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuItem from '@material-ui/core/MenuItem';

import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import {Modal} from "../modal/modal";
import CheckboxValidatorElement from "../form/input/CheckboxValidatorElement";
import {Selectinput} from "../form/input/selectinput";
import TextElement from "../form/input/TextElement";

import Form from "../form/form";

class UserForm extends Component {

    constructor(props) {
        super(props);
        this.form = createRef()
        this.state = {
            currentUserId: this.props.currentUserId,
            user: this.props.initialValues,
            roles: roleService.getRoles(),
            disabled: false
        }
    }

    serUser = user => {
        this.setState({user});
    }

    isEditProfile = () => this.props.currentUserId === this.state.user.id

    handleChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        user[name] = event.target.value;
        this.form.current.isFormValid(false);
        this.setState({user});
    }

    handleCheckboxChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        user[name] = event.target.checked;
        this.form.current.isFormValid(false);
        this.setState({user});
    }

    handleRoleInputChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        const roleId = event.target.value;
        const role = this.state.roles.filter(role => role.id === roleId)[0];
        user[name] = roleId;
        user.role = role;
        this.form.current.isFormValid(false);
        this.setState(user);
    }

    save = () => {
        this.props.onSubmit(_.omit(this.state.user, 'roleId'));
    }

    getRoles = () => {
        return this.state.roles.sort((a, b) => a.id - b.id).map(role => <MenuItem
            key={role.id}
            value={role.id}>{role.name.replace(/^(ROLE_)/, "")}</MenuItem>);
    };

    validatorListener = (result) => {
        this.setState({disabled: !result});
        this.props.setSubmitReadOnly(!result);
    }

    render() {
        const {user} = this.state;
        const {isOpen, handleClose, title, submitTitle, submitReadOnly, readOnly} = this.props;

        if (!user) {
            return null;
        }
        return (
            <Modal isOpen={isOpen}
                   handleClose={handleClose}
                   title={title}
                   handleSubmit={this.save}
                   submitTitle={submitTitle}
                   submitReadOnly={submitReadOnly}>
                <Form onSubmit={this.save} ref={this.form}>
                    <TextElement
                        label="Username"
                        onChange={(readOnly || !!user.id) ? () => {} : this.handleChange}
                        name="username"
                        value={user.username}
                        required
                        readOnly={readOnly || !!user.id}
                        validators={['required', 'minStringLength:7', 'matchRegexp:^[a-z0-9]{7,}$']}
                        errorMessages={['Usernamed is required', 'Username must be 7 or more characters', 'Username contains illegal characters']}
                        validatorListener={this.validatorListener}/>
                    <TextElement
                        label="First name"
                        onChange={this.handleChange}
                        name="firstName"
                        value={user.firstName}
                        required
                        readOnly={readOnly}
                        validators={['required']}
                        errorMessages={['First name is required']}
                        validatorListener={this.validatorListener}
                        />
                    <TextElement
                        label="Middle name"
                        onChange={this.handleChange}
                        name="middleName"
                        value={user.middleName}
                        readOnly={readOnly}
                        validators={[]}
                        errorMessages={[]}
                        validatorListener={this.validatorListener}/>
                    <TextElement
                        label="Last name"
                        onChange={this.handleChange}
                        name="lastName"
                        value={user.lastName}
                        required
                        readOnly={readOnly}
                        validators={['required']}
                        errorMessages={['Last name is required']}
                        validatorListener={this.validatorListener}/>
                    <TextElement
                        label="Email"
                        onChange={this.handleChange}
                        name="email"
                        value={user.email}
                        required
                        readOnly={readOnly}
                        validators={['required', 'isEmail']}
                        errorMessages={['Email is required', 'Email is not valid']}
                        validatorListener={this.validatorListener}/>
                    <TextElement
                        label="Phone"
                        onChange={this.handleChange}
                        name="phone"
                        value={user.phone}
                        required
                        readOnly={readOnly}
                        validators={['required']}
                        errorMessages={['Phone is required']}
                        validatorListener={this.validatorListener}/>
                    <CheckboxValidatorElement
                        name="active"
                        label="Active"
                        checked={user.active}
                        value={user.active}
                        readOnly={readOnly || this.isEditProfile()}
                        onChange={this.handleCheckboxChange}/>
                    <CheckboxValidatorElement
                        name="notLocked"
                        label="Not Locked"
                        checked={user.notLocked}
                        value={user.notLocked}
                        readOnly={readOnly || this.isEditProfile()}
                        onChange={this.handleCheckboxChange}/>
                    <Selectinput id="role" label="Role" value={user.roleId} options={this.getRoles()}
                                 readOnly={readOnly || this.isEditProfile()} onChange={this.handleRoleInputChange}/>
                </Form>
            </Modal>
        );
    }
}

UserForm.propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    currentUserId: PropTypes.number
};
UserForm.defaultProps = {
    initialValues: {},
    onSubmit: () => {},
    readOnly: false
};

export default withSnackbar(UserForm);
