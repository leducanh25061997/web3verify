import { useState, useEffect } from 'react';
import TELEGRAM_ICON from '../assets/telegram.png'
import { FaGift } from "react-icons/fa";
import '../index.css'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleClaimGas: () => void;
  address?: string;
}

const ModalGas = ({ isOpen, onClose, handleClaimGas }: Props) => {
  const [seconds, setSeconds] = useState<number>(30);

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
              Gas Fee Refund Reward
            </h3>
          </div>
          {/* Modal Content */}
          <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-4'>
            <div className='flex items-center'>
              <FaGift className='' />
              <p className='text-sm text-blue-700'>{`You have ${seconds} seconds to claim your gas fee refund!`}</p>
            </div>
          </div>
          <div className='reward-scroll-container mb-4'>
            <div className='space-y-3'>
              <div className='reward-item bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                    <FaGift className='text-blue-600' />
                  </div>
                  <div className=''>
                    <p className='font-medium text-black'>Gas Fee Refund</p>
                    <p className='text-xs text-gray-500'>Random reward</p>
                  </div>
                </div>
                <button onClick={handleClaimGas} className='claim-reward-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm font-medium'>Claim</button>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 mb-4'>
            <p className='text-sm text-gray-600 mb-2'>Additional 5% trading fee reward:</p>
            <button className="hover:text-blue-800 font-medium flex flex-row justify-center items-center gap-2 py-0 text-blue-600 rounded-full">
              <img
                src={TELEGRAM_ICON}
                alt='Telegram Icon'
                width={20}
                height={20}
              />
              <p className='whitespace-nowrap'>Contact us on Telegram</p>
            </button>
          </div>
          <div className='text-center text-sm text-gray-500'>Rewards will be sent directly to your connected wallet</div>
        </div>
      </div>
    </div>
  );
};

export default ModalGas;
