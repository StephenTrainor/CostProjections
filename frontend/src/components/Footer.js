import styles from '../App.module.css';

const Footer = (props) => {
    return (
        <div className={styles.div}>
            <a className={styles.link} href={props.href}>{props.msg}</a>
        </div>
    );
};

Footer.defaultProps = {
    href: "https://iexcloud.io",
    msg: "Data provided by IEX Cloud",
}

export default Footer;
