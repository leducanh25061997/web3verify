// ToastContainer.js
import React, { useState } from 'react';
import Toast from './Toast';
import { v4 as uuidv4 } from 'uuid';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Demo buttons */}
      <div className="flex gap-2 mt-10">
        <button onClick={() => showToast('success', 'Đăng ký thành công!')} className="px-4 py-2 bg-green-500 text-white rounded">Success</button>
        <button onClick={() => showToast('error', 'Lỗi xảy ra!')} className="px-4 py-2 bg-red-500 text-white rounded">Error</button>
        <button onClick={() => showToast('info', 'Thông báo mới!')} className="px-4 py-2 bg-blue-500 text-white rounded">Info</button>
      </div>
    </div>
  );
};

export default ToastContainer;
