import React from "react";
import {InputLabel, Checkbox} from "@material-ui/core";
import red from '@material-ui/core/colors/red';
import {ValidatorComponent} from 'react-material-ui-form-validator';
import FormControl from "@material-ui/core/FormControl";

const red700 = red['700'];

const style = {
    right: 0,
    fontSize: '12px',
    color: red700,
    position: 'absolute',
    marginTop: '-25px',
};

class CheckboxValidatorElement extends ValidatorComponent {

    errorText() {
        const {isValid} = this.state;

        if (isValid) {
            return null;
        }

        return <div style={style}>{this.getErrorMessage()}</div>;
    }

    renderValidatorComponent() {
        const {label, validatorListener, errorMessages, validators, requiredError, value, ...rest} = this.props;

        return (
            <FormControl margin="normal" fullWidth>
                <InputLabel>
                    {label} {this.props.required && '*'}
                </InputLabel>
                <Checkbox
                    {...rest}
                    ref={(r) => {
                        this.input = r;
                    }}
                />
                {this.errorText()}
            </FormControl>
        );
    }
}

export default CheckboxValidatorElement;