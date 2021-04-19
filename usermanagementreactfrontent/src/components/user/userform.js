import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';

import {withSnackbar} from "notistack";
import roleService from "../../service/role.service";
import {Modal} from "../modal/modal";
import {Checkboxinput} from "../form/input/checkboxinput";
import {Selectinput} from "../form/input/selectinput";

class UserForm extends Component {

    constructor(props) {
        super(props);
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
        this.form.isFormValid(false);
        this.setState({user});
    }

    handleCheckboxChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        user[name] = event.target.checked;
        this.setState({user});
    }

    handleRoleInputChange = event => {
        const {user} = this.state;
        const name = event.target.name;
        const roleId = event.target.value;
        const role = this.state.roles.filter(role => role.id === roleId)[0];
        user[name] = roleId;
        user.role = role;
        this.setState(user);
    }

    save = () => {
        this.form.submit();
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
                <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
                    <ValidatorForm ref={r => this.form = r} onSubmit={() => {
                    }} instantValidate autoComplete="off" style={{width: "100%"}}>
                        <TextValidator
                            label="Username"
                            onChange={(readOnly || !!user.id) ? () => {
                            } : this.handleChange}
                            name="username"
                            type="text"
                            value={user.username}
                            required
                            readOnly={readOnly || !!user.id}
                            validators={['required', 'minStringLength:7', 'matchRegexp:^[a-z0-9]{7,}$']}
                            errorMessages={['Usernamed is required', 'Username must be 7 or more characters', 'Username contains illegal characters']}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <TextValidator
                            label="First name"
                            onChange={this.handleChange}
                            name="firstName"
                            type="text"
                            value={user.firstName}
                            required
                            readOnly={readOnly}
                            validators={['required']}
                            errorMessages={['First name is required']}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <TextValidator
                            label="Middle name"
                            onChange={this.handleChange}
                            name="middleName"
                            type="text"
                            value={user.middleName}
                            required
                            readOnly={readOnly}
                            validators={[]}
                            errorMessages={[]}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <TextValidator
                            label="Last name"
                            onChange={this.handleChange}
                            name="lastName"
                            type="text"
                            value={user.lastName}
                            required
                            readOnly={readOnly}
                            validators={['required']}
                            errorMessages={['Last name is required']}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <TextValidator
                            label="Email"
                            onChange={this.handleChange}
                            name="email"
                            type="email"
                            value={user.email}
                            required
                            readOnly={readOnly}
                            validators={['required', 'isEmail']}
                            errorMessages={['Email is required', 'Email is not valid']}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <TextValidator
                            label="Phone"
                            onChange={this.handleChange}
                            name="phone"
                            type="text"
                            value={user.phone}
                            required
                            readOnly={readOnly}
                            validators={['required']}
                            errorMessages={['Phone is required']}
                            validatorListener={this.validatorListener}
                            autoComplete="off"/>
                        <Checkboxinput id="active" label="Active" checked={user.active}
                                       readOnly={readOnly || this.isEditProfile()}
                                       onChange={this.handleCheckboxChange}/>
                        <Checkboxinput id="notLocked" label="Not Locked" checked={user.notLocked}
                                       readOnly={readOnly || this.isEditProfile()}
                                       onChange={this.handleCheckboxChange}/>
                        <Selectinput id="role" label="Role" value={user.roleId} options={this.getRoles()}
                                     readOnly={readOnly || this.isEditProfile()} onChange={this.handleRoleInputChange}/>
                    </ValidatorForm>
                </div>
            </Modal>
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
