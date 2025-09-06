// components/ui/ToastContainer.jsx
import React from 'react';
import useToastStore from '../../store/toastStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 border rounded-lg shadow-lg transition-all duration-300 ${getToastStyles(toast.type)}`}
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && (
                <h4 className="font-medium mb-1">{toast.title}</h4>
              )}
              <p className="text-sm">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
