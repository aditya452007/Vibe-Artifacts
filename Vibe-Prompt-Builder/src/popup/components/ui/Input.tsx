import React from 'react';
import clsx from 'clsx';
import '../../styles/components.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    className,
    label,
    error,
    icon,
    id,
    ...props
}) => {
    return (
        <div className={clsx('input-group', className)}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    id={id}
                    className={clsx('input-field', { 'input-field--error': error, 'input-field--has-icon': icon })}
                    {...props}
                />
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};
