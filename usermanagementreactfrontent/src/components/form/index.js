import React from "react";
import PropTypes from 'prop-types';
import {Textinput} from "./input/textinput";

export class Formcomponent extends React.Component {

    state = {data: this.props.initialData}

    handleInputChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({data:{...this.state, [name]: value}});
    }

    getInputFields = inputFields => {
        return inputFields.map(field => {
            switch (field.type) {
                case "text":
                case "email":
                case "password":
                    return <Textinput key={field.id} id={field.id} type={field.type} label={field.label} value={this.state.data[field.id]} required={field.required} onChange={this.handleInputChange}/>
                default:
                    return null;
            }

        });
    }

    render() {
        const {inputFields, onSubmit} = this.props;
        if(!inputFields) {
            return null;
        }
        return (
            <div style={{display: "flex", justifyContent: "center", margin: 0, padding: 0}}>
                <form style={{width: "100%"}} autoComplete="off" onSubmit={onSubmit}>
                    {this.getInputFields(inputFields)}
                </form>
            </div>
        );
    }
}

Formcomponent.propTypes = {
    initialData: PropTypes.object.isRequired,
    inputFields: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
};
Formcomponent.defaultProps = {

}