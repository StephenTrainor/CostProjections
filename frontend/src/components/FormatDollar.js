import NumberFormat from 'react-number-format';
import styles from './Components.module.css';

const round = (number, precision = 2) => {
    let places = Math.pow(10, precision);

    return Math.round(number * places) / places;
};

const FormatDollar = (props) => {
    return (
        <NumberFormat 
            value={round(props.number, 2)}
            prefix={props.prefix}
            thousandSeparator
            displayType="text"
            renderText={(value) => <h3 className={styles.removeBold}>{props.preText}{value}{props.postText}</h3>}
        />
    )
};

FormatDollar.defaultProps = {
    number: 0,
    prefix: '$',
    preText: '',
    postText: '',
};

export default FormatDollar;
