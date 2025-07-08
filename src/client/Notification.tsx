import React from 'react';

type NotificationProps = {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    onClose?: () => void;
    onAction?: () => void;
    actionText?: string;
};

export const Notification: React.FC<NotificationProps> = ({
    type,
    title,
    message,
    onClose,
    onAction,
    actionText
}) => {
    const getTypeStyles = (type: string): string => {
        switch (type) {
            case 'success':
                return 'bg-green-600 border-green-500';
            case 'warning':
                return 'bg-yellow-600 border-yellow-500';
            case 'error':
                return 'bg-red-600 border-red-500';
            case 'info':
            default:
                return 'bg-blue-600 border-blue-500';
        }
    };

    const getIcon = (type: string): string => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg border ${getTypeStyles(type)} text-white shadow-lg z-50 transform transition-all duration-300`}>
            <div className="flex items-start">
                <span className="text-lg mr-3">{getIcon(type)}</span>
                <div className="flex-1">
                    <h4 className="font-semibold">{title}</h4>
                    {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
                    {onAction && actionText && (
                        <button
                            onClick={onAction}
                            className="mt-2 px-3 py-1 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                        >
                            {actionText}
                        </button>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-2 text-white hover:text-gray-200 text-lg"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default Notification;
