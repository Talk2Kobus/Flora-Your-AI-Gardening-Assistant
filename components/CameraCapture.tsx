import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
          }
        } else {
            setError("Your browser does not support camera access.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check your browser permissions.");
      }
    };

    startCamera();

    return () => {
      // Stop all tracks of the stream when the component unmounts
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 shadow-xl max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
        {error ? (
          <div className="text-center text-red-500 py-10">
            <p className="mb-4">{error}</p>
            <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Close</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-gray-900" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white ring-4 ring-inset ring-black/20 hover:ring-black/40 transition-all focus:outline-none"
                aria-label="Capture photo"
              ></button>
            </div>
             <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white text-2xl bg-black/30 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition-colors"
              aria-label="Close camera"
            >
              &times;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;