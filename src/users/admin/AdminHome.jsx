import ThemeToggle from '../../components/ThemeToggle'
import { Link } from 'react-router-dom'
import { adminProfile } from '../../api/adminApi'
import { useEffect, useState, useContext } from 'react'
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { AuthContext } from '../../context/AuthContext'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import handleApiError from '../../utils/HandleAPIERROR'

function formatDate(date) {
    if (!date) return "";
    if (date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
            return date; 
        }
    }
    
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString();
}

function getAge(dateOfBirth) {
    if (!dateOfBirth) return "";
    
    if (dateOfBirth.includes('/')) {
        const parts = dateOfBirth.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; 
            const year = parseInt(parts[2]);
            const dob = new Date(year, month, day);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            return age;
        }
    }
    
    const dob = new Date(dateOfBirth);
    if (isNaN(dob)) return "";
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export default function AdminHome() {
    const [userInfo, setUserInfo] = useState({});
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const { LogOut } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogout = async () => {
        await LogOut();
    }
    useEffect(() => {
        async function getUserInfo(userId) {
            try {
                setLoading(true);
                const res = await adminProfile(userId);
                setUserInfo(res.data.admin);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        
        if (userId) {
            getUserInfo(userId);
        } else {
            setError('User ID not found. Please login again.');
        }
    }, [userId]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {loading && <Loading />}
            {error && <Toast text={error} color={'red'} />}
            <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center justify-start gap-2'>
                    <h3 className='text-2xl'>Admin Profile</h3>
                </div>
                <ThemeToggle />
            </div>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full'>
                <div className={`${windowWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img
                        src={userInfo.profilePic || "/images/adminSVG.svg"}
                        alt="profile"
                        className='w-full h-full rounded-3xl object-cover'
                        onError={(e) => {
                            e.target.src = "/images/default-profile.svg";
                        }}
                    />
                </div>
                <div className='w-full md:w-3/4'>
                    <div className='grid grid-cols-2  md:grid-cols-3 gap-4 mt-1'>
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
                            <p>{getAge(userInfo.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h3 className='font-bold'>Admin Id</h3>
                            <p>{userInfo.adminId || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h3 className='font-bold'>Admin Password</h3>
                            <p className='flex items-center justify-between gap-2'>
                                {userInfo.normalPassword ? 
                                    (showPassword ? userInfo.normalPassword : '*'.repeat(userInfo.normalPassword.length)) 
                                    : ""}
                                <button onClick={togglePasswordVisibility} className="ml-2">
                                    {showPassword ? 
                                        <EyeOffIcon size={16} /> : 
                                        <EyeIcon size={16} />
                                    }
                                </button>
                            </p>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h3 className='font-bold'>Email</h3>
                            <p>{userInfo.email || "-"}</p>
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
                    </div>
                </div>
            </div>
            <div className='pt-4'>
                <h3 className='font-bold text-2xl'>Others</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-4'>
                    <Link to='/admin/updatesemster'
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12 mb-2' />
                        <p>Update Semester</p>
                    </Link>
                    <Link to='/admin/profiles'
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12 mb-2' />
                        <p>Profiles</p>
                    </Link>
                    <Link to={`/admin/editAdmin/${userId}`}
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12 mb-2' />
                        <p>Edit Profile</p>
                    </Link>
                    {windowWidth < 786 &&
                        <>
                            <Link to="/admin/courses"
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/courses.svg" alt="courses"
                                    className="w-12 h-12 mb-2" />
                                <p>Courses</p>
                            </Link>
                            <Link to='/admin/newStudent'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/newUser.svg" alt="newStudent"
                                    className="w-12 h-12 mb-2" />
                                <p>New Student</p>
                            </Link>
                            <Link to='/admin/newLecturer'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/newUser.svg" alt="newInstructor"
                                    className="w-12 h-12 mb-2" />
                                <p>New Lecturer</p>
                            </Link>
                            <Link to='/admin/newAdmin'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/newUser.svg" alt="newAdmin"
                                    className="w-12 h-12 mb-2" />
                                <p>New Admin</p>
                            </Link>
                            <Link to='/admin/result'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center justify-center hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <img src="/images/result.svg" alt="results"
                                    className="w-12 h-12 mb-2" />
                                <p>Results</p>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-red-600 dark:bg-red-900 dark:text-red-100 rounded-2xl p-4 shadow-md hover:cursor-pointer hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-200 ease-in-out">
                                <p>Logout</p>
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}