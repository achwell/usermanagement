import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import {Modal} from "../modal/modal";
import Form from "../form/form";

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        if (!ValidatorForm.hasValidationRule('isPasswordMatch')) {
            ValidatorForm.addValidationRule('isPasswordMatch', value => value === this.state.formData.newPassword);
        }
        if (!ValidatorForm.hasValidationRule('isOldPasswordMatch')) {
            ValidatorForm.addValidationRule('isOldPasswordMatch', value => this.verifyPasswords(value, this.state.existingPassword));
        }
        this.form = createRef()
        this.state = {
            formData: {
                oldPassword: '',
                newPassword: '',
                verifyNewPassword: ''
            },
            newPassword: '',
            existingPassword: this.props.existingPassword,
            disabled: true
        }
    }

    componentWillUnmount() {
        if (ValidatorForm.hasValidationRule('isPasswordMatch')) {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }
        if (ValidatorForm.hasValidationRule('isOldPasswordMatch')) {
            ValidatorForm.removeValidationRule('isOldPasswordMatch');
        }
    }

    setExistingPassword = existingPassword => {
        this.setState({existingPassword});
    }

    hashPassword = password => {
        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    verifyPasswords = (oldPassword, hash) => {
        return bcrypt.compareSync(oldPassword, hash);
    }

    handleChange = (event) => {
        const {formData} = this.state;
        const name = event.target.name;
        formData[name] = event.target.value;
        this.form.current.isFormValid(false);
        this.setState({formData});
    }

    submit = () => {
        this.form.current.submit();
        const newPassword = this.hashPassword(this.state.formData.newPassword);
        this.setState({
            formData: {oldPassword: '', newPassword: '', verifyNewPassword: ''},
            newPassword,
            existingPassword: '',
            disabled: true
        })
        return newPassword;
    }

    validatorListener = (result) => {
        this.setState({disabled: !result});
        this.props.setSubmitReadOnly(!result);
    }

    render() {
        const {formData} = this.state;
        const {isOpen, handleClose, onSubmit, title, submitTitle, submitReadOnly} = this.props;
        return (
            <Modal isOpen={isOpen}
                   handleClose={handleClose}
                   title={title}
                   handleSubmit={onSubmit}
                   submitTitle={submitTitle}
                   submitReadOnly={submitReadOnly}>
                <Form ref={this.form} onSubmit={() => { }}>
                    <TextValidator
                        variant="outlined"
                        label="Old password"
                        onChange={this.handleChange}
                        name="oldPassword"
                        type="password"
                        value={formData.oldPassword}
                        validators={['required', 'isOldPasswordMatch']}
                        errorMessages={['Old password is required', 'password mismatch']}
                        validatorListener={this.validatorListener}
                        autoComplete="off"/>
                    <TextValidator
                        variant="outlined"
                        label="New password"
                        onChange={this.handleChange}
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        validators={['required']}
                        errorMessages={['New password is required']}
                        validatorListener={() => this.validatorListener(this)}
                        autoComplete="off"/>
                    <TextValidator
                        variant="outlined"
                        label="Verify new password"
                        onChange={this.handleChange}
                        name="verifyNewPassword"
                        type="password"
                        value={formData.verifyNewPassword}
                        validators={['required', 'isPasswordMatch']}
                        errorMessages={['Verify new password is required', 'password mismatch']}
                        validatorListener={this.validatorListener}
                        autoComplete="off"/>
                </Form>
            </Modal>
        );
    }
}

ChangePassword.propTypes = {
    existingPassword: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setValidationErrors: PropTypes.func
};
ChangePassword.defaultProps = {
    existingPassword: '',
    onSubmit: password => {
    },
    setValidationErrors: () => {
    }
};

export default ChangePassword;