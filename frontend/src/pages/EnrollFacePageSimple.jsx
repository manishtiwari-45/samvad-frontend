import React, { useState, useEffect, useRef } from 'react';
import { authApi } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Camera, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const EnrollFacePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const { showSuccess, showError } = useNotifications();

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraReady(true);
                };
            }
        } catch (err) {
            console.error("Camera access error:", err);
            showError('Camera Error', 'Could not access camera. Please check permissions and try again.');
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas && cameraReady) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(dataUrl);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const enrollFace = async () => {
        if (!capturedImage) {
            showError('Error', 'Please capture a photo first');
            return;
        }

        setIsEnrolling(true);
        try {
            // Convert dataURL to blob
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            
            await authApi.enrollFace(blob);
            showSuccess('Success!', 'Face enrolled successfully! You can now use AI attendance.');
            setCapturedImage(null);
        } catch (error) {
            console.error('Enrollment error:', error);
            showError('Enrollment Failed', 'Failed to enroll face. Please try again with better lighting.');
        } finally {
            setIsEnrolling(false);
        }
    };

    return (
        <div className="min-h-screen bg-background mobile-container">
            <div className="max-w-2xl mx-auto py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Face Enrollment</h1>
                    <p className="text-gray-600">
                        Enroll your face for AI-powered attendance tracking
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Position your face in the center of the camera</li>
                        <li>• Ensure good lighting on your face</li>
                        <li>• Look directly at the camera</li>
                        <li>• Remove glasses or masks if possible</li>
                    </ul>
                </div>

                {/* Camera Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        {/* Video Preview */}
                        {!capturedImage ? (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-80 object-cover rounded-lg bg-gray-100"
                                />
                                {!cameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                        <div className="text-center">
                                            <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                                            <p className="text-gray-600">Starting camera...</p>
                                        </div>
                                    </div>
                                )}
                                {/* Face guide overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-48 h-60 border-2 border-white border-dashed rounded-full opacity-50"></div>
                                </div>
                            </div>
                        ) : (
                            /* Captured Image Preview */
                            <div className="relative">
                                <img
                                    src={capturedImage}
                                    alt="Captured face"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                                <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            </div>
                        )}

                        {/* Hidden canvas for image capture */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-6">
                        {!capturedImage ? (
                            <button
                                onClick={capturePhoto}
                                disabled={!cameraReady}
                                className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all ${
                                    cameraReady
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <Camera className="h-5 w-5" />
                                <span>Capture Photo</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={retakePhoto}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={enrollFace}
                                    disabled={isEnrolling}
                                    className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all ${
                                        isEnrolling
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                                    } text-white`}
                                >
                                    {isEnrolling ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                            <span>Enrolling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            <span>Enroll Face</span>
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                            <p className="font-medium mb-1">Privacy Notice</p>
                            <p>
                                Your face data is securely stored and used only for attendance tracking. 
                                It will not be shared with third parties and you can delete it anytime from your profile settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollFacePage;
