/* eslint-disable react-hooks/exhaustive-deps */
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

  // const [cameraReady, setCameraReady] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(currentIndex, 'currentIndex')
  const [countdownCap, setCountdownCap] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  console.log(capturedImages, 'capturedImages');

  const [startVerification, setStartVerification] = useState<boolean>(false);
  const [instructionTitle, setInstructionTitle] = useState<string | null>('');
  const [motionSteps, setMotionSteps] = useState([
    {
      action: 'quay mặt sang trái',
      iconIndex: 0,
      duration: 5,
      isVerify: false,
      title: 'Turn left',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    },
    {
      action: 'quay mặt sang phải',
      iconIndex: 1,
      duration: 5,
      isVerify: false,
      title: 'Turn right',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    },
    {
      action: 'nhìn lên',
      iconIndex: 2,
      duration: 5,
      isVerify: false,
      title: 'Look up',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    },
    {
      action: 'nhìn xuống',
      iconIndex: 3,
      duration: 5,
      isVerify: false,
      title: 'Look down',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    },
    {
      action: 'nhìn thẳng', iconIndex: 4, duration: 5, isVerify: false, title: 'Look straight again',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
  ]);
  const isCancelledRef = useRef(false);
  const [done, setDone] = useState<boolean>(false);
  // const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const processItems = async () => {
    for (let i = 0; i < motionSteps.length; i++) {
      if (isCancelledRef.current) return;
      setInstructionTitle(motionSteps[i].action)
      setCurrentIndex(i);
      const duration = motionSteps[i].duration;

      for (let t = duration; t >= 0; t--) {
        if (isCancelledRef.current) return;
        setCountdownCap(t);
        await sleep(1000);
      }
      setMotionSteps(prevItems =>
        prevItems.map((item, index) =>
          index === i ? { ...item, isVerify: true } : item
        )
      );
      if (isCancelledRef.current) return;
      captureImage();
    }
    setInstructionTitle('');
    setStartVerification(false);
    if (!isCancelledRef.current) setDone(true);
  };

  // console.log(motionSteps, 'motionSteps')
  useEffect(() => {
    if (startVerification) {
      isCancelledRef.current = false;
      processItems();
    }
    // console.log(startVerification, currentIndex >= motionSteps.length)
    // if (!startVerification) return;
    // // setCountdown(5); 
    // const timer = setInterval(() => {
    //   setCountdownCap((prev) => {

    //     if (prev === 1) {
    //       clearInterval(timer);
    //       captureImage();

    //       if (currentIndex < motionSteps.length) {

    //         console.log('-------------11111')
    //         setCurrentIndex((idx) => idx + 1);

    //         return 5;
    //       }
    //     }
    //     return prev - 1;
    //   });
    // }, 1000);

    // return () => clearInterval(timer);
  }, [startVerification]);

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL('image/jpeg');
    setCapturedImages((prev) => [...prev, image]);
    console.log(`Captured image for item ${currentIndex + 1}`);
  };

  // const [loadingCamera, setLoadingCamera] = useState(false);
  const [countdown, setCountdown] = useState(0); // 0 nghĩa là chưa đếm
  const [isRunning, setIsRunning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const [recording, setRecording] = useState(false);
  // const [videoUrl, setVideoUrl] = useState<string | null>(null);
  // const chunks = useRef<Blob[]>([]);

  // const videoRef1 = useRef<HTMLVideoElement | null>(null);
  // const mediaRecorderRef1 = useRef<MediaRecorder | null>(null);
  // const [recording1, setRecording1] = useState(false);
  // const [videoUrl1, setVideoUrl1] = useState<string | null>(null);
  // const chunks1 = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      isCancelledRef.current = true;
      // setIsCancelled(true);
      setStartVerification(false);
      setCapturedImages([]);
      setStream((prev) => {
        prev?.getTracks().forEach((track) => track.stop());
        return null;
      });
      setCountdownCap(0);
      setDone(false);


      setMotionSteps(prevItems =>
        prevItems.map((item) => {
          return { ...item, isVerify: false }
        })
      );
      document.body.style.overflow = 'auto';
    }

    // Reset lại khi unmount modal
    return () => {
      setStartVerification(false)
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
      // setRecording(false);
      // alert("Countdown finished!");
    }
    return () => clearTimeout(timer);
  }, [countdown, isRunning]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

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
    isCancelledRef.current = true;
    // setIsCancelled(true);
    setStartVerification(false);
    setCapturedImages([]);
    setStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setCountdownCap(0);
    setDone(false);


    setMotionSteps(prevItems =>
      prevItems.map((item) => {
        return { ...item, isVerify: false }
      })
    );
  };

  const handleTryAgain = async () => { 
    try {
      // setLoadingCamera(true);
      isCancelledRef.current = true;
      // setIsCancelled(true);
      setStartVerification(false);
      setCapturedImages([]);
      setStream((prev) => {
        prev?.getTracks().forEach((track) => track.stop());
        return null;
      });
      setDone(false);
  
  
      setMotionSteps(prevItems =>
        prevItems.map((item) => {
          return { ...item, isVerify: false }
        })
      );

      const media = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
      // setCameraReady(true);
      setStartVerification(true);
      setCountdownCap(5);
    } catch (err) {
      alert('Không thể truy cập camera.');
    } finally {
      // setLoadingCamera(false);
    }
  }

  const startCameraAndCountdown = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
      // setCameraReady(true);
      setStartVerification(true);
      setCountdownCap(5);
    } catch (err) {
      alert('Không thể truy cập camera.');
    } finally {
      // setLoadingCamera(false);
    }
  };

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //       videoRef.current.play();
  //     }

  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     chunks.current = [];

  //     mediaRecorder.ondataavailable = (event: BlobEvent) => {
  //       if (event.data.size > 0) {
  //         chunks.current.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = () => {
  //       // const blob = new Blob(chunks.current, { type: 'video/webm' });
  //       // const url = URL.createObjectURL(blob);
  //       // setVideoUrl(url);

  //       // Dừng stream
  //       stream.getTracks().forEach(track => track.stop());
  //     };

  //     mediaRecorder.start();
  //     setRecording(true);
  //   } catch (error) {
  //     console.error('Error accessing media devices:', error);
  //   }
  // };

  // const stopRecording = () => {
  //   setCountdown(10);
  //   setIsRunning(true);
  //   // mediaRecorderRef.current?.stop();
  //   // setRecording(false);
  // };


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

  // const handleStarVerify = () => {
  //   setStartVerification(true)
  // }

  const handleCancelVerify = () => {
    isCancelledRef.current = true;
    // setIsCancelled(true);
    setStartVerification(false);
    setCapturedImages([]);
    setStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setCountdownCap(0);
    setDone(false);


    setMotionSteps(prevItems =>
      prevItems.map((item) => {
        return { ...item, isVerify: false }
      })
    );
  }

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
                    <p className='text-gray-600 mb-6'>Please position your face within the frame and follow the instructions to complete the verification.</p>
                    {/* <div className="flex items-center justify-center mb-12 px-8">
                      <div className="flex flex-col items-center">
                        <div className="progress-step rounded-full bg-blue-600 text-white flex items-center justify-center mb-2">
                          <span className="font-medium">1</span>
                        </div>
                        <span className="text-sm font-medium">Xác thực khuôn mặt</span>
                      </div>
                    </div> */}
                    <div id="face-verification" className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex flex-col gap-8">
                        <div className="w-full">
                          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Face Verification</h2> */}
                          {/* <p className="text-gray-600 mb-6">Please position your face within the frame and follow the instructions to complete the verification.</p> */}

                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                              </svg>
                              <p className="font-medium text-blue-800">Instructions</p>
                            </div>
                            <p id="motion-instruction" className="mt-2 text-blue-700">{!startVerification && !done ? 'Look straight at the camera to begin.' : instructionTitle ? instructionTitle : 'Xác thực khuôn mặt hoàn tất!'}</p>
                          </div>

                          <div className="flex justify-between mb-6" id="pose-steps">
                            {motionSteps.map((motionStep, i) => (
                              <div className="flex flex-col items-center" key={i}>
                                <div className={`${motionStep.isVerify ? 'text-green-500' : 'face-pose-icon text-gray-300'} mb-1`}>
                                  {motionStep.isVerify ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 success-check" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                  ) : motionStep.icon}
                                </div>
                                <span className="text-xs">{motionStep.title}</span>
                              </div>
                            ))}
                            {/*  <div className="flex flex-col items-center">
                              <div className="face-pose-icon text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                              </div>
                              <span className="text-xs">Turn left</span>
                            </div>
                           <div className="flex flex-col items-center">
                              <div className="face-pose-icon text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <span className="text-xs">Turn right</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="face-pose-icon text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                                </svg>
                              </div>
                              <span className="text-xs">Look up</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="face-pose-icon text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                              <span className="text-xs">Look down</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="face-pose-icon text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-xs">Look straight again</span>
                            </div> */}
                          </div>

                          <div className="video-container mb-4">
                            <video ref={videoRef} id="video" autoPlay playsInline muted className="w-full h-auto bg-gray-900"></video>
                            <div className="face-guide">
                              <div className="w-[124px] h-[124px] md:w-[200px] md:h-[200px] rounded-full border-[3px] border-dashed border-blue-500/70 relative"></div>
                            </div>
                            <div id="countdown-timer" className={`${startVerification ? 'flex' : 'hidden'} countdown-timer`}>{countdownCap}</div>
                          </div>

                          {startVerification && (
                            <div className="flex justify-center gap-4">
                              <button id="retry-btn" className="hidden bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                                Try Again
                              </button>
                              <button onClick={handleCancelVerify} id="cancel-btn" className="bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors">
                                Cancel
                              </button>
                            </div>
                          )}

                          <div id="match-result" className="hidden p-3 rounded-lg text-center font-medium"></div>

                          {!startVerification && !done && (
                            <button id="start-btn" onClick={startCameraAndCountdown} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
                              </svg>
                              Start Verification
                            </button>
                          )}

                          {!startVerification && done && (
                            <button id="start-btn" onClick={handleTryAgain} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
                              </svg>
                              Try Again
                            </button>
                          )}

                          <div id="submit-section" className="hidden mt-4">
                            <button id="submit-btn" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                              Confirm and Submit
                            </button>
                          </div>
                        </div>

                        <div className="w-full">

                        </div>
                      </div>
                    </div>



                    {/* <div className='video-preview w-full h-48 mb-4 flex items-center justify-center relative'>
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
                    </div> */}
                    {/* <p className='text-sm text-gray-600'>Please look straight at the camera and follow the instructions.</p> */}
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
