import React, {forwardRef, useImperativeHandle, useRef} from "react";import {ValidatorForm} from 'react-material-ui-form-validator';
import PropTypes from "prop-types";

const Form = forwardRef((props, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            isFormValid(isValid) {
                checkIsFormValid(isValid);
            },
            submit() {
                doSubmit();
            }
        }),
    )

    const formRef = useRef();

    const checkIsFormValid  = isValid => formRef.current.isFormValid(isValid)

    const doSubmit = () => formRef.current.submit()

    return (
        <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
            <ValidatorForm ref={formRef} onSubmit={props.onSubmit} instantValidate
                           autoComplete="off"
                           style={{width: "100%"}}>
                {props.children}
            </ValidatorForm>
        </div>
    );
});

Form.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}

export default Form;