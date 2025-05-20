// Toast.js
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const toastStyles = {
  success: 'bg-green-100 border-green-400 text-green-800',
  error: 'bg-red-100 border-red-400 text-red-800',
  info: 'bg-blue-100 border-blue-400 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
};

const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        className={`w-full max-w-sm shadow-lg rounded-md border-l-4 p-4 mb-3 ${toastStyles[type]}`}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 text-lg font-bold">&times;</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
