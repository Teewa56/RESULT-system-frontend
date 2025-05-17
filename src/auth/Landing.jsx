import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    function gotoSignIn(user) {
        localStorage.setItem('userType', user);
        navigate('/signIn');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 max-w-md mx-auto">
            <div className="flex flex-col w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h1 className="font-black text-2xl text-center text-gray-800 mb-6">Sign In As</h1>
                <div
                    className="flex flex-col items-center p-4 mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                    onClick={() => gotoSignIn('student')}
                >
                    <img className="w-12 h-12 mb-2" src="/images/studentSVG.svg" alt="Student" />
                    <h3 className="text-lg font-medium text-gray-700">Student</h3>
                </div>
                <div
                    className="flex flex-col items-center p-4 mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                    onClick={() => gotoSignIn('lecturer')}
                >
                    <img className="w-12 h-12 mb-2" src="/images/lecturerSVG.svg" alt="Lecturer" />
                    <h3 className="text-lg font-medium text-gray-700">Lecturer</h3>
                </div>
                <div
                    className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                    onClick={() => gotoSignIn('admin')}
                >
                    <img className="w-12 h-12 mb-2" src="/images/adminSVG.svg" alt="Admin" />
                    <h3 className="text-lg font-medium text-gray-700">Admin</h3>
                </div>
            </div>
        </div>
    );
}