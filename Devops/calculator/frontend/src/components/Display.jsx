import styles from './Calculator.module.css';

const Display = ({ current, history, loading, isError }) => {
    return (
        <div className={styles.displayContainer}>
            <div className={styles.history}>{history}</div>
            <div className={`${styles.current} ${loading ? styles.blink : ''} ${isError ? styles.error : ''}`}>
                {loading ? 'Calculating...' : current}
            </div>
        </div>
    );
};

export default Display;
