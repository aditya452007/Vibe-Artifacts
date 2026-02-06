import styles from './Calculator.module.css';

const Button = ({ label, onClick, type = 'number', active = false, className = '' }) => {
    const getClass = () => {
        let baseClass = styles.button;
        if (type === 'operator') baseClass += ` ${styles.operator}`;
        if (type === 'function') baseClass += ` ${styles.function}`;
        if (type === 'equals') baseClass += ` ${styles.equals}`;
        if (active) baseClass += ` ${styles.activeOperator}`;
        if (className) baseClass += ` ${className}`;
        return baseClass;
    };

    return (
        <button className={getClass()} onClick={onClick} type="button">
            {label}
        </button>
    );
};

export default Button;
