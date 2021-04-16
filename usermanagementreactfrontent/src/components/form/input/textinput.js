import React from "react";
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import {FormHelperText, Input, InputLabel} from "@material-ui/core";

export const Textinput = ({id, type, label, value, required, readOnly, autoComplete, onChange, hasError, errorMessage}) => {
    return (
        <FormControl error={hasError} margin="normal" fullWidth>
            <InputLabel htmlFor={id}>
                {label} {required && '*'}
                <FormHelperText className="error">{errorMessage}</FormHelperText>
            </InputLabel>
            <Input id={id} name={id} readOnly={readOnly} type={type} required={required} value={value}
                   error={hasError} onChange={onChange} autoComplete={autoComplete}/>
        </FormControl>

    );
};
Textinput.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoComplete: PropTypes.oneOf(["on", "off"]),
    onChange: PropTypes.func,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string
};
Textinput.defaultProps = {
    type: 'text',
    value: '',
    required: false,
    readOnly: false,
    autoComplete: "off",
    onChange: () => { },
    hasError: false,
    errorMessage: ''
};