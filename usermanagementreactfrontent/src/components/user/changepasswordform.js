import React, {Component} from 'react';
import bcrypt from 'bcryptjs';
import PropTypes from 'prop-types';
import {Textinput} from "../form/input/textinput";
import {Formcomponent} from "../form";

class ChangePasswordForm extends Component {

    state = {
        existingPassword: this.props.existingPassword,
        oldPassword: '',
        newPassword: '',
        verifyNewPassword: '',
        formErrors: {oldPassword: '', newPassword: '', verifyNewPassword: ''},
        fieldErrors: {oldPassword: true, newPassword: true, verifyNewPassword: true},
        formValid: false
    };

    handleInputChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.validateField(name, value)
    }

    hashPassword = password => {
        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    verifyPasswords = (oldPassword, hash) => {
        return bcrypt.compareSync(oldPassword, hash);
    }

    validateField(fieldName, value) {
        const {formErrors, fieldErrors, existingPassword, newPassword, verifyNewPassword} = this.state;

        let oldPasswordValid = !fieldErrors.existingPassword;
        let newPasswordValid = !fieldErrors.newPassword;
        let verifyNewPasswordValid = !fieldErrors.verifyNewPassword;

        switch (fieldName) {
            case 'oldPassword':
                oldPasswordValid = this.verifyPasswords(value, existingPassword);
                formErrors.oldPassword = oldPasswordValid ? '' : ' does not match existing password';
                fieldErrors.oldPassword = !oldPasswordValid;
                break;
            case 'newPassword':
                newPasswordValid = value.length >= 6;
                formErrors.newPassword = newPasswordValid ? '' : ' is too short';
                fieldErrors.newPassword = !newPasswordValid;
                if (newPasswordValid) {
                    if (!this.verifyPasswords(value, this.hashPassword(verifyNewPassword))) {
                        formErrors.newPassword = 'does not match verifyNewPassword'
                        fieldErrors.newPassword = true;
                        formErrors.verifyNewPassword = 'does not match newPassword'
                        fieldErrors.verifyNewPassword = true;
                    } else {
                        formErrors.newPassword = ''
                        fieldErrors.newPassword = false;
                        formErrors.verifyNewPassword = ''
                        fieldErrors.verifyNewPassword = false;
                    }
                }
                break;
            case 'verifyNewPassword':
                verifyNewPasswordValid = value.length >= 6;
                formErrors.verifyNewPassword = verifyNewPasswordValid ? '' : ' is too short';
                fieldErrors.verifyNewPassword = !verifyNewPasswordValid;
                if (verifyNewPasswordValid) {
                    if (!this.verifyPasswords(value, this.hashPassword(newPassword))) {
                        formErrors.newPassword = 'does not match verifyNewPassword'
                        fieldErrors.newPassword = true;
                        formErrors.verifyNewPassword = 'does not match newPassword'
                        fieldErrors.verifyNewPassword = true;
                    } else {
                        formErrors.newPassword = ''
                        fieldErrors.newPassword = false;
                        formErrors.verifyNewPassword = ''
                        fieldErrors.verifyNewPassword = false;
                    }
                }
                break;
            default:
                break;
        }
        this.setState({formErrors, fieldErrors})
        this.validateForm();
    }

    validateForm = () => {
        const {oldPassword, newPassword, verifyNewPassword} = this.state.fieldErrors;
        const formValid = !oldPassword && !newPassword && !verifyNewPassword;
        this.setState({formValid});
        this.props.setValidationErrors(formValid);
    }

    save = () => {
        this.props.onSubmit(this.state.newPassword);
    }

    render() {
        const {oldPassword, newPassword, verifyNewPassword, formErrors} = this.state;
        return (
            <Formcomponent formErrors={formErrors}>
                <Textinput id="oldPassword" type="password" label="Old password" value={oldPassword} required
                           onChange={this.handleInputChange}/>
                <Textinput id="newPassword" type="password" label="New password" value={newPassword} required
                           onChange={this.handleInputChange}/>
                <Textinput id="verifyNewPassword" type="password" label="Verify new password" value={verifyNewPassword}
                           required onChange={this.handleInputChange}/>
            </Formcomponent>
        );
    }
}

ChangePasswordForm.propTypes = {
    existingPassword: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setValidationErrors: PropTypes.func
};
ChangePasswordForm.defaultProps = {
    existingPassword: '',
    onSubmit: password => {},
    setValidationErrors: () => {}
};

export default ChangePasswordForm;