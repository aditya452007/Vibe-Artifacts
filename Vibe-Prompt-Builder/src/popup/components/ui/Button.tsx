import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge'; // Assuming we might add tailwind later, but for now using SCSS classes
import '../../styles/components.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'btn',
                `btn--${variant}`,
                `btn--${size}`,
                { 'btn--loading': isLoading },
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className="spinner" /> : children}
        </button>
    );
};
