import { useState, useEffect, useRef } from 'react';
import ETHEREUM_ICON from '../assets/ethereum.png'
import { FaRegIdCard, FaRegImage } from "react-icons/fa";
import '../index.css'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  address?: string;
}

const Modal = ({ isOpen, onClose, address = '0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a' }: Props) => {
  // const [file, setFile] = useState(null);
  // const [fileFrontkSide, setFileFrontSide] = useState<any>(null);
  // const [fileBackSide, setFileBackSide] = useState<any>(null);
  // const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [previewFrontSideUrl, setPreviewFrontsideUrl] = useState<any>(null);
  const [previewBackSideUrl, setPreviewBackSideUrl] = useState<any>(null);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const videoRef: any = useRef(null);
  // const videoRef1: any = useRef(null);
  // const canvasRef = useRef(null);
  // const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  // const [isCameraOn1, setIsCameraOn1] = useState<boolean>(false);

  const [countdown, setCountdown] = useState(0); // 0 nghĩa là chưa đếm
  const [isRunning, setIsRunning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  // const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);

  // const videoRef1 = useRef<HTMLVideoElement | null>(null);
  // const mediaRecorderRef1 = useRef<MediaRecorder | null>(null);
  // const [recording1, setRecording1] = useState(false);
  // const [videoUrl1, setVideoUrl1] = useState<string | null>(null);
  // const chunks1 = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // setRecording1(false);
      setRecording(false);
      document.body.style.overflow = 'auto';
    }

    // Reset lại khi unmount modal
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isRunning) {
      // Hết giờ
      setIsRunning(false);
      mediaRecorderRef.current?.stop();
      setRecording(false);
      // alert("Countdown finished!");
    }
    return () => clearTimeout(timer);
  }, [countdown, isRunning]);

  const handleFileChange = (event: any, type: string) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Tạo URL cho preview
    const preview = URL.createObjectURL(selectedFile);
    if (type === "FRONT_SIDE") {
      // setFileFrontSide(selectedFile)
      setPreviewFrontsideUrl(preview);
    } else {
      // setFileBackSide(selectedFile);
      setPreviewBackSideUrl(preview)
    }
    // setFile(selectedFile);
    // setPreviewUrl(preview);
    // setUploadProgress(0);  // Reset progress bar
  };

  // Bắt đầu camera
  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     videoRef.current.srcObject = stream;
  //     setIsCameraOn(true);
  //   } catch (error: any) {
  //     alert("Camera not accessible: " + error.message);
  //   }
  // };

  // const startCamera1 = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     videoRef1.current.srcObject = stream;
  //     setIsCameraOn1(true);
  //   } catch (error: any) {
  //     alert("Camera not accessible: " + error.message);
  //   }
  // };

  // Tắt camera
  // const stopCamera = () => {
  //   const stream = videoRef.current.srcObject;
  //   const tracks = stream.getTracks();
  //   tracks.forEach((track: any) => track.stop());
  //   videoRef.current.srcObject = null;
  //   setIsCameraOn(false);
  // };

  // const stopCamera1 = () => {
  //   const stream = videoRef1.current.srcObject;
  //   const tracks = stream.getTracks();
  //   tracks.forEach((track: any) => track.stop());
  //   videoRef1.current.srcObject = null;
  //   setIsCameraOn1(false);
  // };

  const handleClose = () => {
    onClose();
    mediaRecorderRef.current?.stop();
    // mediaRecorderRef1.current?.stop();
    // setRecording1(false);
    setRecording(false);
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // const blob = new Blob(chunks.current, { type: 'video/webm' });
        // const url = URL.createObjectURL(blob);
        // setVideoUrl(url);

        // Dừng stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    setCountdown(10);
    setIsRunning(true);
    // mediaRecorderRef.current?.stop();
    // setRecording(false);
  };


  // const startRecording1 = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  //     if (videoRef1.current) {
  //       videoRef1.current.srcObject = stream;
  //       videoRef1.current.play();
  //     }

  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef1.current = mediaRecorder;
  //     chunks1.current = [];

  //     mediaRecorder.ondataavailable = (event: BlobEvent) => {
  //       if (event.data.size > 0) {
  //         chunks1.current.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = () => {
  //       // const blob = new Blob(chunks1.current, { type: 'video/webm' });
  //       // const url = URL.createObjectURL(blob);
  //       // setVideoUrl1(url);

  //       // Dừng stream
  //       stream.getTracks().forEach(track => track.stop());
  //     };

  //     mediaRecorder.start();
  //     setRecording1(true);
  //   } catch (error) {
  //     console.error('Error accessing media devices:', error);
  //   }
  // };

  // const stopRecording1 = () => {
  //   mediaRecorderRef1.current?.stop();
  //   setRecording1(false);
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto relative animate-[fadeIn_0.3s_ease-out] py-12 sm:px-2" onClick={(e) => e.stopPropagation()}>
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
            <div className='kyc-step sm:pl-10'>
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
            <div className='kyc-step sm:pl-10'>
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
                          onChange={e => handleFileChange(e, "FRONT_SIDE")}
                          accept="image/*"
                        />
                        <label htmlFor="frontUpload" className='cursor-pointer flex flex-col items-center'>
                          <FaRegImage className='text-2xl text-gray-600 mb-2' />
                          <p className='font-medium text-black'>Front Side</p>
                          <p className='text-xs text-gray-500 mt-1'>Click to upload</p>
                        </label>
                        {previewFrontSideUrl && (
                          <div className='mt-2'>
                            <img
                              src={previewFrontSideUrl}
                              alt="Preview"
                              className="w-full h-32 object-contain rounded"
                            />
                          </div>
                        )}
                        {/* {file && uploadProgress > 0 && (
                          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full text-xs text-white text-center rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                        )} */}
                      </div>
                      <div className='file-upload rounded-lg p-6 text-center cursor-pointer'>
                        <input
                          type="file"
                          id='backUpload'
                          className="hidden"
                          onChange={e => handleFileChange(e, "BACK_SIDE")}
                          accept="image/*"
                        />
                        <label htmlFor="backUpload" className='cursor-pointer flex flex-col items-center'>
                          <FaRegImage className='text-2xl text-gray-600 mb-2' />
                          <p className='font-medium text-black'>Back Side</p>
                          <p className='text-xs text-gray-500 mt-1'>Click to upload</p>
                        </label>
                        {previewBackSideUrl && (
                          <div className='mt-2'>
                            <img
                              src={previewBackSideUrl}
                              alt="Preview"
                              className="w-full h-32 object-contain rounded"
                            />
                          </div>
                        )}
                        {/* {file && uploadProgress > 0 && (
                          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full text-xs text-white text-center rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='kyc-step sm:pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>3</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Facial Recognition</h4>
                    <div className='video-preview w-full h-48 mb-4 flex items-center justify-center relative'>
                      <video ref={videoRef} className={`w-full h-full object-cover ${recording ? 'flex' : 'hidden'}`} autoPlay muted />
                      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        {!recording ? (
                          <button className='bg-white text-blue-600 px-4 rounded-lg font-medium flex fle-row items-center py-2' onClick={startRecording}>🎬 Bắt đầu quay</button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            disabled={isRunning}
                            className={`px-5 py-2 border border-gray-300 rounded-lg transition duration-300 text-white font-semibold ${isRunning
                                ? "bg-transparent hover:bg-gray-400 hover:border hover:border-black"
                                : "bg-transparent hover:bg-blue-700"
                              }`}
                          >
                            {isRunning ? `Wait ${countdown}s` : "⏹ Dừng quay"}
                          </button>
                          // <button className='border border-gray-300 rounded-lg font-medium flex fle-row items-center py-2 px-4' onClick={stopRecording}>⏹ Dừng quay</button>
                        )}
                      </div>
                      {/* {videoUrl && (
                        <div style={{ marginTop: '1rem' }}>
                          <h3>🎞 Xem lại video:</h3>
                          <video src={videoUrl} controls width={640} />
                          <div>
                            <a href={videoUrl} download="video.webm">⬇️ Tải video</a>
                          </div>
                        </div>
                      )} */}
                    </div>
                    <p className='text-sm text-gray-600'>Please look straight at the camera and follow the instructions.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='kyc-step sm:pl-10'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <span className='text-blue-600 font-bold'>3</span>
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-gray-800 mb-3'>
                    <h4 className='font-medium text-gray-800 mb-3'>Facial Recognition</h4>
                    <div className='video-preview w-full h-48 mb-4 flex items-center justify-center relative'>
                      <video ref={videoRef1} className={`w-full h-full object-cover ${recording1 ? 'flex' : 'hidden'}`} autoPlay muted />
                      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        {!recording1 ? (
                          <button className='bg-white text-blue-600 px-4 rounded-lg font-medium flex fle-row items-center py-2' onClick={startRecording1}>🎬 Bắt đầu quay</button>
                        ) : (
                          <button className='border border-gray-300 rounded-lg font-medium flex fle-row items-center py-2 px-4' onClick={stopRecording1}>⏹ Dừng quay</button>
                        )}
                      </div>
                    </div>
                    <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4'>
                      <p className='text-sm text-yellow-700'>Please hold your document next to your face and say: "I verify that this is my authentic document for Web3Verify"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
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
