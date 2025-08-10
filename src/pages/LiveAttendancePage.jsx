import React, { useState, useEffect, useRef } from 'react';
import { Camera, Zap, CheckCircle, UserX, Users } from 'lucide-react';

const LiveAttendancePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const wsRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState({ status: 'INITIALIZING', name: 'System Ready' });
    const [attendedList, setAttendedList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Webcam ko shuru karein
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError("Could not access webcam. Please check permissions.");
            }
        };

        startCamera();

        // 2. Naye "general" WebSocket se connect karein
        const wsUrl = `ws://127.0.0.1:8000/attendance/ws/general`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => setIsConnected(true);
        wsRef.current.onclose = () => setIsConnected(false);
        wsRef.current.onerror = () => setError("Connection to attendance server failed.");

        // 3. Backend se message receive karein
        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLastMessage(data);

            if ((data.status === 'SUCCESS' || data.status === 'ALREADY_MARKED')) {
                setAttendedList(prevList => {
                    // Duplicate entry ko rokne ke liye
                    if (prevList.find(user => user.id === data.id)) {
                        return prevList;
                    }
                    return [{ id: data.id, name: data.name }, ...prevList];
                });
            }
        };

        // 4. Har 2 second mein video ka frame backend ko bhejein
        const intervalId = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN && videoRef.current) {
                const video = videoRef.current;
                // Check karein ki video capture karne ke liye taiyaar hai ya nahi
                if (video.readyState >= 3) {
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Quality kam karke speed badhayein
                    wsRef.current.send(dataUrl);
                }
            }
        }, 2000);

        // 5. Component band hone par sab kuch saaf karein
        return () => {
            clearInterval(intervalId);
            if (wsRef.current) wsRef.current.close();
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Yeh effect sirf ek baar chalta hai

    // Status ke hisaab se message dikhane wala helper function
    const getStatusDisplay = () => {
        switch (lastMessage.status) {
            case 'SUCCESS':
                return <div className="text-center bg-green-100 text-green-800 p-4 rounded-lg"><CheckCircle className="mx-auto h-12 w-12"/><p className="font-bold mt-2">Attendance Marked: {lastMessage.name}</p></div>;
            case 'ALREADY_MARKED':
                return <div className="text-center bg-blue-100 text-blue-800 p-4 rounded-lg"><CheckCircle className="mx-auto h-12 w-12"/><p className="font-bold mt-2">Welcome Back, {lastMessage.name}!</p><p className="text-sm">Attendance already marked for today.</p></div>;
            case 'NOT_FOUND':
                return <div className="text-center bg-red-100 text-red-800 p-4 rounded-lg"><UserX className="mx-auto h-12 w-12"/><p className="font-bold mt-2">Face Not Recognized</p><p className="text-sm">Please ensure you are enrolled.</p></div>;
            default:
                return <div className="text-center bg-gray-100 text-gray-800 p-4 rounded-lg"><Zap className="mx-auto h-12 w-12"/><p className="font-bold mt-2">System Ready</p><p className="text-sm">Position face in the camera.</p></div>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <Camera size={32} className="mr-3 text-indigo-600"/>
                    Live AI Attendance
                </h1>
                <p className={`mt-2 font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? '● Connected' : '● Disconnected'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative shadow-lg">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>
                    {getStatusDisplay()}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Users size={22} className="mr-3"/> Marked Present ({attendedList.length})
                    </h2>
                    <ul className="space-y-3 h-96 overflow-y-auto">
                        {attendedList.map(user => (
                            <li key={user.id} className="p-3 bg-green-50 rounded-lg font-semibold text-green-800">
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default LiveAttendancePage;