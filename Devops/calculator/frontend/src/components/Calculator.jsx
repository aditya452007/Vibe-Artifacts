import { useState } from 'react';
import styles from './Calculator.module.css';
import Display from './Display';
import Button from './Button';
import { calculate } from '../services/api';

const Calculator = () => {
    // Current input string (e.g., "53")
    const [current, setCurrent] = useState('0');
    // Visual history string (e.g., "12 + ")
    const [history, setHistory] = useState('');
    // Stored first operand for API
    const [prevOperand, setPrevOperand] = useState(null);
    // Stored operator id for API (e.g., 'add')
    const [operator, setOperator] = useState(null);
    // Flag to clear current input on next number press
    const [waitingForNewInput, setWaitingForNewInput] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // reset all state
    const handleClear = () => {
        setCurrent('0');
        setHistory('');
        setPrevOperand(null);
        setOperator(null);
        setWaitingForNewInput(false);
        setError(null);
    };

    const handleDigit = (digit) => {
        if (waitingForNewInput) {
            setCurrent(String(digit));
            setWaitingForNewInput(false);
        } else {
            setCurrent(current === '0' ? String(digit) : current + digit);
        }
    };

    const handleDecimal = () => {
        if (waitingForNewInput) {
            setCurrent('0.');
            setWaitingForNewInput(false);
            return;
        }
        if (!current.includes('.')) {
            setCurrent(current + '.');
        }
    };

    const mapOperatorToSymbol = (op) => {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'power': return '^';
            case 'percentage': return '%';
            case 'sqrt': return '√';
            default: return '';
        }
    };

    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(current);
        const symbol = mapOperatorToSymbol(nextOperator);

        // Immediate operations (single operand)
        if (nextOperator === 'sqrt') {
            performCalculation('sqrt', inputValue, null);
            return;
        }

        if (prevOperand === null) {
            // First time operator is pressed
            setPrevOperand(inputValue);
            setHistory(`${inputValue} ${symbol}`);
            setWaitingForNewInput(true);
            setOperator(nextOperator);
        } else if (operator && !waitingForNewInput) {
            // Chaining operations: 5 + 3 + ... -> effectively calculates 8 +
            // But we actually need to calculate the intermediate result to show it?
            // PRD allows basic simple flow. Let's execute the pending one first.
            performCalculation(operator, prevOperand, inputValue).then((result) => {
                setPrevOperand(parseFloat(result)); // Store result as new first operand
                setHistory(`${result} ${symbol}`);
                setOperator(nextOperator);
                setWaitingForNewInput(true);
            }).catch(() => {
                // Error handled in performCalculation
            });
        } else {
            // Just changing the operator while waiting for new input
            setHistory(`${prevOperand} ${symbol}`);
            setOperator(nextOperator);
        }
    };

    const performCalculation = async (op, op1, op2 = null) => {
        setLoading(true);
        setError(null);
        try {
            // Visual update before request
            if (op2 !== null) {
                setHistory(`${op1} ${mapOperatorToSymbol(op)} ${op2} =`);
            } else {
                // single operand
                setHistory(`${mapOperatorToSymbol(op)}(${op1}) =`);
            }

            const result = await calculate(op, op1, op2);

            // On success
            setCurrent(String(result));
            return result; // return for chaining
        } catch (err) {
            setError(err.message);
            setHistory(''); // Clear history on error to avoid confusion
            setWaitingForNewInput(true); // Reset so next type clears error
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleEqual = () => {
        if (!operator || prevOperand === null) return;

        const inputValue = parseFloat(current);
        performCalculation(operator, prevOperand, inputValue).then(() => {
            setPrevOperand(null);
            setOperator(null);
            setWaitingForNewInput(true);
        });
    };

    return (
        <div className={styles.calculator}>
            <Display
                current={error || current}
                history={history}
                loading={loading}
                isError={!!error}
            />
            <div className={styles.keypad}>
                <Button label="C" onClick={handleClear} type="function" />
                <Button label="√" onClick={() => handleOperator('sqrt')} type="function" />
                <Button label="%" onClick={() => handleOperator('percentage')} type="function" />
                <Button label="÷" onClick={() => handleOperator('divide')} type="operator" active={operator === 'divide'} />

                <Button label="7" onClick={() => handleDigit(7)} />
                <Button label="8" onClick={() => handleDigit(8)} />
                <Button label="9" onClick={() => handleDigit(9)} />
                <Button label="×" onClick={() => handleOperator('multiply')} type="operator" active={operator === 'multiply'} />

                <Button label="4" onClick={() => handleDigit(4)} />
                <Button label="5" onClick={() => handleDigit(5)} />
                <Button label="6" onClick={() => handleDigit(6)} />
                <Button label="−" onClick={() => handleOperator('subtract')} type="operator" active={operator === 'subtract'} />

                <Button label="1" onClick={() => handleDigit(1)} />
                <Button label="2" onClick={() => handleDigit(2)} />
                <Button label="3" onClick={() => handleDigit(3)} />
                <Button label="+" onClick={() => handleOperator('add')} type="operator" active={operator === 'add'} />

                <Button label="0" onClick={() => handleDigit(0)} className={styles.zero} />
                <Button label="." onClick={handleDecimal} />
                <Button label="=" onClick={handleEqual} type="equals" />
            </div>
        </div>
    );
};

export default Calculator;
