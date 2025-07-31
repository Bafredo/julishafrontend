import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`
        flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg max-w-sm
        ${type === 'success' 
          ? 'text-green-800 bg-green-50 border border-green-200' 
          : 'text-red-800 bg-red-50 border border-red-200'
        }
      `}>
        {type === 'success' ? (
          <CheckCircle className="flex-shrink-0 w-4 h-4 mr-3" />
        ) : (
          <XCircle className="flex-shrink-0 w-4 h-4 mr-3" />
        )}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className={`
            ml-3 p-1 rounded-md hover:bg-opacity-20 transition-colors
            ${type === 'success' ? 'hover:bg-green-200' : 'hover:bg-red-200'}
          `}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;