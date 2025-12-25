import React, { useState, useEffect, useRef } from 'react';
import { authApi } from '../services/api';
import { Camera, Upload, Loader2 } from 'lucide-react';

const EnrollFacePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Webcam shuru karne ke liye
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError("Could not access webcam. Please check permissions.");
            }
        };

        startCamera();

        // Cleanup function
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Yeh effect sirf ek baar chalta hai

    // Photo capture karne ke liye
    const handleCapture = () => {
        setError('');
        setMessage('');
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
        }
    };

    // Enroll karne ke liye
    const handleEnroll = () => {
        if (!capturedImage) {
            setError("Please capture a photo first.");
            return;
        }
        
        canvasRef.current.toBlob(async (blob) => {
            setIsEnrolling(true);
            setMessage('Enrolling your face... Please wait.');
            try {
                await authApi.enrollFace(blob);
                setMessage('Enrollment Successful! You can now use AI attendance.');
                setCapturedImage(null); // Reset after success
            } catch (err) {
                const errorDetail = err.response?.data?.detail || "Enrollment failed. Please try again with a clear photo.";
                setError(errorDetail);
                setMessage('');
            } finally {
                setIsEnrolling(false);
            }
        }, 'image/jpeg');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Face Enrollment</h1>
            <p className="text-center text-gray-500 mb-6">Enroll your face for AI-powered attendance.</p>

            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                {capturedImage && (
                    <img src={capturedImage} alt="Captured face" className="absolute inset-0 w-full h-full object-cover"/>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {message && <p className="text-green-600 text-center mt-4">{message}</p>}

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button onClick={handleCapture} disabled={isEnrolling} className="flex-1 flex justify-center items-center bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                    <Camera size={20} className="mr-2"/> {capturedImage ? 'Retake Photo' : 'Capture Photo'}
                </button>
                <button onClick={handleEnroll} disabled={!capturedImage || isEnrolling} className="flex-1 flex justify-center items-center bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400">
                    {isEnrolling ? <Loader2 size={20} className="animate-spin mr-2"/> : <Upload size={20} className="mr-2"/>}
                    Enroll This Photo
                </button>
            </div>
        </div>
    );
};

export default EnrollFacePage;