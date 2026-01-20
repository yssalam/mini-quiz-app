import { cn } from '../../utils/cn';

const Checkbox = ({
    id,
    label,
    checked,
    onChange,
    disabled = false,
    className
}) => {
    return (
        <div className="flex items-center">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={cn(
                    'h-4 w-4 rounded border-gray-300 bg-white',
                    'text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                    'cursor-pointer transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
            />
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        'ml-2 block text-sm text-gray-700 select-none',
                        !disabled && 'cursor-pointer'
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;