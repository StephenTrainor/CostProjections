import { TextField } from '@mui/material';
import NumberFormat from 'react-number-format';

import styles from './Components.module.css';
import { errorConstants } from '../AppConstants';

const { requiredFieldErrorText } = errorConstants.errorMessages;

const CustomFormatTextField = (props) => {
    const { onChangeFunction, userInputValues, errors, field, ...otherProps } = props;

    const fieldErrorText = `${field}ErrorText`; // help me access the ErrorText for each field, see default props in AppConstants.js
    const helperText = errors[fieldErrorText] || ((errors[field]) ? requiredFieldErrorText : ''); 

    return (
        <NumberFormat 
            className={styles.userInput}
            customInput={TextField}
            variant="outlined"
            name={field}
            id={field}
            value={userInputValues[field]}
            error={errors[field]}
            helperText={helperText}
            thousandSeparator
            isNumericString
            required
            onChange={(event) => {onChangeFunction(event)}}
            {...otherProps}
        />
    )
};

CustomFormatTextField.defaultProps = {
    onChangeFunction: () => {}
};

export default CustomFormatTextField;
