import { TextField } from '@mui/material';
import NumberFormat from 'react-number-format';
import styles from './Components.module.css';

const CustomFormatTextField = (props) => {
    const { onChangeFunction, ...otherProps } = props;

    return (
        <NumberFormat 
            className={styles.userInput}
            customInput={TextField}
            variant="outlined"
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
