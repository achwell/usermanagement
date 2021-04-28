import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import TextElement from "../form/input/TextElement";
import {Modal} from "../modal/modal";
import Form from "../form/form";

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.form = createRef()
        this.state = {
            formData: { email: '' }
        }
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
        const email = this.state.formData.email;
        this.setState({ formData: {email: ''} })
        return email;
    }

    validatorListener = (result) => {
        this.props.setSubmitReadOnly(!result);
    }

    render() {
        const {formData} = this.state;
        const {isOpen, handleClose, onSubmit, title, submitTitle, submitReadOnly, readOnly} = this.props;
        if(isOpen === undefined) {
            return null;
        }
        return (
            <Modal isOpen={isOpen}
                   handleClose={handleClose}
                   title={title}
                   handleSubmit={onSubmit}
                   submitTitle={submitTitle}
                   submitReadOnly={submitReadOnly}>
                <Form ref={this.form} onSubmit={() => { }}>
                    <TextElement
                        label="Email"
                        onChange={this.handleChange}
                        name="email"
                        value={formData.email}
                        required
                        readOnly={readOnly}
                        validators={['required', 'isEmail']}
                        errorMessages={['Email is required', 'Email is not valid']}
                        validatorListener={this.validatorListener}/>
                </Form>
            </Modal>
        );
    }
}

ResetPassword.propTypes = {
    existingPassword: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
};
ResetPassword.defaultProps = {
    existingPassword: '',
    onSubmit: password => {
    }
};

export default ResetPassword;