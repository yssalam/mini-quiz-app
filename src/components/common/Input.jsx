import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className,
    id,
    ...props
}, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}

            <input
                id={inputId}
                type={type}
                ref={ref}
                className={cn(
                    'w-11/12 px-4 py-2 border rounded-lg transition-colors duration-200',
                    'bg-white text-gray-900',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'placeholder:text-gray-400',
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 hover:border-gray-400',
                    'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
                    className
                )}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;