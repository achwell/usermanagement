import React from "react";
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import {Checkbox, FormHelperText, InputLabel} from "@material-ui/core";

export const Checkboxinput = ({id, label, checked, required, readOnly, onChange, hasError, errorMessage}) => {
    return (
        <FormControl error={hasError} margin="normal" fullWidth>
            <InputLabel htmlFor={id}>
                {label} {required && '*'}
                <FormHelperText className="error">{errorMessage}</FormHelperText>
            </InputLabel>
            <Checkbox id={id} name={id} readOnly={readOnly} required={required} checked={checked} onChange={onChange}/>
        </FormControl>

    );
};
Checkboxinput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string
};
Checkboxinput.defaultProps = {
    required: false,
    readOnly: false,
    checked: false,
    onChange: () => {},
    hasError: false,
    errorMessage: ''
};
