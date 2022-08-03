import styles from './Components.module.css';

const ApiLink = (props) => {
    return (
        <div className={styles.linkContainer}>
            <a href={props.href}>{props.linkText}</a>
        </div>
    );
};

ApiLink.defaultProps = {
    href: "https://iexcloud.io",
    linkText: "Data provided by IEX Cloud"
};

export default ApiLink;
