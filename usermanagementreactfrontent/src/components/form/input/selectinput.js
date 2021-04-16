import React from "react";
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import {FormHelperText, InputLabel, Select} from "@material-ui/core";

export const Selectinput = ({id, label, value, required, readOnly, onChange, hasError, errorMessage, options}) => {
    return (
        <FormControl error={hasError} margin="normal" fullWidth>
            <InputLabel id={`${id}-label`}>
                {label} {required && '*'}
                <FormHelperText className="error">{errorMessage}</FormHelperText>
            </InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                name={id}
                readOnly={readOnly}
                required={required}
                value={value}
                onChange={onChange}
                autoWidth
            >
                {options}
            </Select>
        </FormControl>
    );
};
Selectinput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string,
    options: PropTypes.array.isRequired
};
Selectinput.defaultProps = {
    required: false,
    readOnly: false,
    value: '',
    onChange: () => {},
    hasError: false,
    errorMessage: '',
    options: []
};
