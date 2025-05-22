import { useState, useEffect } from 'react';
import '../index.css'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  address?: string;
}

const ModalConfirmGasFeePayment = ({ isOpen, onClose }: Props) => {
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    if (seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup khi component unmount
  }, [seconds]);

  // Callback khi hết giờ
  useEffect(() => {
    if (seconds === 0) {
      // onClose();
    }
  }, [seconds, onClose]);

  const handleClose = () => {
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto relative animate-[fadeIn_0.3s_ease-out] py-12 sm:py-4 sm:px-2" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button
            className="absolute top-5 right-4 text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            &times;
          </button>

          {/* Modal Title */}
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-bold text-gray-800'>
            Confirm Gas Fee Payment
            </h3>
          </div>
          {/* Modal Content */}
          <div className='bg-gray-50 rounded-lg p-4 mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-gray-600'>Reward Amount:</span>
              <span className='font-medium text-black'>$1.24</span>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-gray-600'>Estimated Gas Fee:</span>
              <span className='font-medium text-black'>$0.15</span>
            </div>
          </div>
          <div className='mb-4'>
            <p className='text-sm text-gray-600 mb-2'>You'll receive:</p>
            <div className='bg-green-50 border-l-4 border-green-500 p-3'>
              <p className='font-medium text-green-700'>$1.09</p>
            </div>
          </div>
          <div className='flex justify-end space-x-3'>
            <button onClick={onClose} className='px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50'>Cannel</button>
            <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium'>Confirm & Sign</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmGasFeePayment;
