import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    className
}) => {
    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-500',
            titleColor: 'text-green-800',
            messageColor: 'text-green-700',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-500',
            titleColor: 'text-red-800',
            messageColor: 'text-red-700',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            iconColor: 'text-yellow-500',
            titleColor: 'text-yellow-800',
            messageColor: 'text-yellow-700',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-500',
            titleColor: 'text-blue-800',
            messageColor: 'text-blue-700',
        },
    };

    const {
        icon: Icon,
        bgColor,
        borderColor,
        iconColor,
        titleColor,
        messageColor
    } = config[type];

    return (
        <div
            className={cn(
                'flex gap-3 p-4 rounded-lg border',
                bgColor,
                borderColor,
                className
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColor)} />

            <div className="flex-1">
                {title && (
                    <h4 className={cn('font-semibold text-sm mb-1', titleColor)}>
                        {title}
                    </h4>
                )}
                {message && (
                    <p className={cn('text-sm', messageColor)}>
                        {message}
                    </p>
                )}
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className={cn(
                        'flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
                        iconColor
                    )}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;