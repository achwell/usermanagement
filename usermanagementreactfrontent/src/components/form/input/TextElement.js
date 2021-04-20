import {TextValidator} from 'react-material-ui-form-validator';

class TextElement extends TextValidator {}

TextElement.defaultProps = {
    type: "text",
    variant: 'outlined',
    autoComplete: 'off',
    fullWidth: true,
    validatorListener: () => {}
};

export default TextElement;
