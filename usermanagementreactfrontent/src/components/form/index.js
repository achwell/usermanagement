import React from "react";
import {FormErrors} from "./formerrors";
import PropTypes from 'prop-types';

export const Formcomponent = (props) => (
    <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
        <form style={{width: "100%"}} autoComplete="off">
            <FormErrors formErrors={props.formErrors}/>
            {props.children}
        </form>
    </div>
);
Formcomponent.propTypes = {
    formErrors: PropTypes.object
};
Formcomponent.defaultProps = {
    formErrors: {}
}