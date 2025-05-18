import Toast from '../../components/Toast'
import { useState, useEffect, useContext } from 'react'
import { lecturerProfile } from '../../api/lecturerApi'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import ThemeToggle from '../../components/ThemeToggle'
import handleApiError from '../../utils/HandleAPIERROR'

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString();
}

function getAge(dateOfBirth) {
    if (!dateOfBirth || typeof dateOfBirth !== 'string') return '-';
    const parts = dateOfBirth.split('/');
    if (parts.length !== 3) return '-';

    const [day, month, year] = parts.map(part => parseInt(part, 10));
    if (!year || year < 1900 || year > new Date().getFullYear()) return '-';

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const LecturerProfileSkeleton = () => {
    const isMobile = window.innerWidth < 768;
    
    return (
        <div className="animate-pulse">
            <div className="flex items-center justify-between mb-5">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-start gap-5 w-full">
                <div className={`${isMobile ? 'w-1/3' : 'w-1/4'} h-40 bg-gray-200 dark:bg-gray-700 rounded-3xl`}></div>
                <div className="md:w-3/4 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="flex flex-col items-start">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
                {isMobile && (
                    <div className="w-full flex flex-col gap-3">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-3xl h-16"></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function LecturerHome() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [error, setError] = useState(null);
    const { LogOut, error: authError } = useContext(AuthContext);
    const handleLogout = async () => {
        await LogOut();
    }
    const userId = localStorage.getItem('userId');
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        async function fetchProfile() {
            setError(null);
            try {
                setLoading(true);
                const res = await lecturerProfile(userId);
                setUserInfo(res.data.lecturer);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred")
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [userId])

    const displayError = error || authError;

    return (
        <div className='pb-4'>
            {displayError && <Toast text={displayError} color='red' />}
            
            <div className='flex items-center justify-between mb-5'>
                <h3 className='text-2xl'>Lecturer Profile</h3>
                <ThemeToggle />
            </div>

            {loading ? (
                <LecturerProfileSkeleton />
            ) : (
                <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full'>
                    <div className={`${isMobile ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                        <img 
                            src={userInfo.profilePic || "/images/lecturerSVG.svg"} 
                            alt="profile" 
                            className='w-full h-full rounded-3xl object-cover' 
                        />
                    </div>
                    <div className='md:w-3/4 w-full'>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-1'>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Full Name</h3>
                                <p>{userInfo.fullName || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Date of Birth</h3>
                                <p>{formatDate(userInfo.dateOfBirth)}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Age</h3>
                                <p>{getAge(userInfo.dateOfBirth) || 10}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Registration Id</h3>
                                <p>{userInfo.registrationId || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Email</h3>
                                <p style={{fontSize: '15px'}}>{userInfo.email || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>State of origin</h3>
                                <p>{userInfo.stateOfOrigin || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Phone Number</h3>
                                <p>{userInfo.phone || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Gender</h3>
                                <p>{userInfo.gender || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Department</h3>
                                <p>{userInfo.department || "-"}</p>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h3 className='font-bold'>Date Employed</h3>
                                <p>{formatDate(userInfo.dateEmployed)}</p>
                            </div>
                        </div>
                    </div>
                    {isMobile && (
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
                            <Link to='/lecturer/courses'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/courses.svg" alt="courses"
                                    className="w-full h-10" />
                                <p>Courses</p>
                            </Link>
                            <Link to='/lecturer/results'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/result.svg" alt="results"
                                    className="w-full h-10" />
                                <p>Results</p>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-300 rounded-2xl p-4 shadow-md hover:cursor-pointer hover:opacity-0.8 transition-all duration-200 ease-in-out">
                                <p>Logout</p>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}