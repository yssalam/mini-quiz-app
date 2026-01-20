import { cn } from '../../utils/cn';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
                hover && 'transition-all duration-200 hover:shadow-md hover:border-gray-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};


Card.Header = ({ children, className, ...props }) => (
    <div className={cn('mb-4', className)} {...props}>
        {children}
    </div>
);

Card.Title = ({ children, className, ...props }) => (
    <h3 className={cn('text-xl font-bold text-gray-900', className)} {...props}>
        {children}
    </h3>
);

Card.Description = ({ children, className, ...props }) => (
    <p className={cn('text-sm text-gray-600 mt-1', className)} {...props}>
        {children}
    </p>
);

Card.Content = ({ children, className, ...props }) => (
    <div className={cn('', className)} {...props}>
        {children}
    </div>
);

Card.Footer = ({ children, className, ...props }) => (
    <div className={cn('mt-4 pt-4 border-t border-gray-200', className)} {...props}>
        {children}
    </div>
);

export default Card;