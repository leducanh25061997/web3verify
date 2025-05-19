import React, { useState, useEffect, useRef } from 'react';
import ETHEREUM_ICON from './assets/ethereum.png'
import { FaRegIdCard, FaRegImage, FaVideo } from "react-icons/fa";
import './index.css'

const Modal = ({ isOpen, onClose, address = '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a' }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const videoRef1 = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCameraOn1, setIsCameraOn1] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setIsCameraOn(false);
      setIsCameraOn1(false);
      document.body.style.overflow = 'auto';
    }

    // Reset lại khi unmount modal
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Tạo URL cho preview
    const preview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(preview);
    setUploadProgress(0);  // Reset progress bar
  };

  const handleUpload = () => {
    const fakeUpload = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(fakeUpload);
          alert(`Uploaded ${file.name} successfully!`);
          setFile(null);
          setPreviewUrl(null);
          return 0;
        }
        return prevProgress + 10;
      });
    }, 300);
  };

  // Bắt đầu camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      alert("Camera not accessible: " + error.message);
    }
  };

  const startCamera1 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef1.current.srcObject = stream;
      setIsCameraOn1(true);
    } catch (error) {
      alert("Camera not accessible: " + error.message);
    }
  };

  // Tắt camera
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
  };

  const stopCamera1 = () => {
    const stream = videoRef1.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef1.current.srcObject = null;
    setIsCameraOn1(false);
  };

  const handleClose = () => {
    onClose();
    stopCamera()
    stopCamera1()
   
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto relative animate-[fadeIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Modal Title */}
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-bold text-gray-800'>
              Identity Verification (KYC)
            </h3>
          </div>
          <div className='mb-6'>
            <div className='flex flex-row items-center'>
              <img
                src={ETHEREUM_ICON}
                alt='Ethereum Icon'
                width={24}
                height={24}
              />
              <p className='font-mono text-sm text-gray-700'>{address}</p>
            </div>
            <p className='text-sm text-gray-600'>Please complete the following steps to verify your identity for this wallet address.</p>
          </div>
          {/* Modal Content */}
          <div className='space-y-8'>
            <div className='kyc-step pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>1</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Provide Identification Document</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <button className='flex flex-col justify-center items-center doc-type-btn border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors'>
                        <FaRegIdCard className='text-2xl text-gray-600 mb-2' />
                        <p className='font-medium'>National ID Card</p>
                      </button>
                      <button className='flex flex-col justify-center items-center doc-type-btn border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors'>
                        <FaRegIdCard className='text-2xl text-gray-600 mb-2' />
                        <p className='font-medium'>Passport</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='kyc-step pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>2</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Upload Document Images</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <div className='file-upload rounded-lg p-6 text-center cursor-pointer'>
                        <input
                          type="file"
                          id='frontUpload'
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <label for="frontUpload" className='cursor-pointer flex flex-col items-center'>
                          <FaRegImage className='text-2xl text-gray-600 mb-2' />
                          <p className='font-medium text-black'>Front Side</p>
                          <p className='text-xs text-gray-500 mt-1'>Click to upload</p>
                        </label>
                        {previewUrl && (
                          <div className='mt-2'>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-32 object-contain rounded"
                            />
                          </div>
                        )}
                        {file && uploadProgress > 0 && (
                          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full text-xs text-white text-center rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='file-upload rounded-lg p-6 text-center cursor-pointer'>
                        <input
                          type="file"
                          id='frontUpload'
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <label for="frontUpload" className='cursor-pointer flex flex-col items-center'>
                          <FaRegImage className='text-2xl text-gray-600 mb-2' />
                          <p className='font-medium text-black'>Front Side</p>
                          <p className='text-xs text-gray-500 mt-1'>Click to upload</p>
                        </label>
                        {previewUrl && (
                          <div className='mt-2'>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-32 object-contain rounded"
                            />
                          </div>
                        )}
                        {file && uploadProgress > 0 && (
                          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full text-xs text-white text-center rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='kyc-step pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>3</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Facial Recognition</h4>
                    <div className='video-preview w-full h-48 mb-4 flex items-center justify-center'>
                      {!isCameraOn && (
                        <button onClick={startCamera} className='bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex fle-row items-center'>
                          <FaVideo className='mr-2' />
                          Start Recording
                        </button>)}
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className={`w-full h-full object-cover ${isCameraOn ? 'flex' : 'hidden'}`}
                      />
                    </div>
                    <p className='text-sm text-gray-600'>Please look straight at the camera and follow the instructions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='kyc-step pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>3</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Facial Recognition</h4>
                    <div className='video-preview w-full h-48 mb-4 flex items-center justify-center'>
                      {!isCameraOn1 && (
                        <button onClick={startCamera1} className='bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex fle-row items-center'>
                          <FaVideo className='mr-2' />
                          Start Recording
                        </button>)}
                      <video
                        ref={videoRef1}
                        autoPlay
                        muted
                        className={`w-full h-full object-cover ${isCameraOn1 ? 'flex' : 'hidden'}`}
                      />
                    </div>
                    <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4'>
                      <p className='text-sm text-yellow-700'>Please hold your document next to your face and say: "I verify that this is my authentic document for Web3Verify"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {children} */}

          {/* Modal Footer */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled
            >
              Submit Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
