import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import Loading from '../components/Loaidng';
import {useNavigate} from 'react-router-dom';

export default function SignIn() {
    const userType = localStorage.getItem('userType');
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        userId: '', 
        adminPassword: '',
    });
    const { LogInstudent, LogInlecturer, LogInadmin, error } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    function updateUserInfo(field, value) {
        setUserInfo((prev) => ({
            ...prev,
            [field]: value.trim(),
        }));
    }

    function getPlaceholder(userType) {
        if (userType === 'admin') return 'Enter Admin Id e.g ABCD/1234';
        if (userType === 'lecturer') return 'Enter Lecturer registration Id e.g ABCD/1234';
        return 'Enter Student matric number e.g ABC/23/2009';
    }

    async function signInUser(e) {
        e.preventDefault(); 
        try {
            setLoading(true);
            const payload = {data: {...userInfo}};
            if (userType === 'admin') await LogInadmin(payload);
            if (userType === 'lecturer') await LogInlecturer(payload);
            if (userType === 'student') {await LogInstudent(payload);}
            setLoading(false);
            navigate(`/${userType}`)
        } catch (error) {
            console.error("Error during sign-in:", error);
            setLoading(false);
        }
        
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-center mb-6">
                    Sign In as <span className="capitalize">{userType}</span>
                </h3>
                <form onSubmit={signInUser} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="fullName" className="text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={userInfo.fullName}
                            onChange={(e) => updateUserInfo('fullName', e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="userId" className="text-sm font-medium mb-1">
                            User ID
                        </label>
                        <input
                            id="userId"
                            type="text"
                            required
                            placeholder={getPlaceholder(userType)}
                            value={userInfo.userId}
                            onChange={(e) => updateUserInfo('userId', e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {userType === 'admin' && (
                        <div className="flex flex-col">
                            <label htmlFor="adminPassword" className="text-sm font-medium mb-1">
                                Admin Password
                            </label>
                            <input
                                id="adminPassword"
                                type="password"
                                required
                                placeholder="Enter your admin password"
                                value={userInfo.adminPassword}
                                onChange={(e) => updateUserInfo('adminPassword', e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}}`}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}