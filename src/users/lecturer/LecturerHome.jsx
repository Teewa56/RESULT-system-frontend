import Toast from '../../components/Toast'
import { useState, useEffect, useContext } from 'react'
import { lecturerProfile } from '../../api/lecturerApi'
import Loading from '../../components/Loaidng'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import ThemeToggle from '../../components/ThemeToggle'

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString();
}

function getAge(dateOfBirth) {
    if (!dateOfBirth) return "";
    const dob = new Date(dateOfBirth);
    if (isNaN(dob)) return "";
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export default function LecturerHome() {
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [Error, setError] = useState(null);
    const { LogOut, error } = useContext(AuthContext);
    const handleLogout = async () => {
        await LogOut();
    }
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError(null);
            try {
                const res = await lecturerProfile(userId);
                setUserInfo(res.data.lecturer);
            } catch (err) {
                setError(err.message || "Failed to fetch profile.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [userId]);

    return (
        <div>
            {loading && <Loading />}
            {error && <Toast text={error} color='red' />}
            {Error && <Toast text={Error} color={'red'} />}
            <div className='flex items-center justify-between mb-5'>
                <h3 className='text-2xl'>Lecturer Profile</h3>
                <ThemeToggle />
            </div>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full'>
                <div className={`${window.innerWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img src={userInfo.profilePic || "/mypic.png"} alt="profile" className='w-full h-full rounded-3xl object-cover' />
                </div>
                <div className='w-3/4'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-1'>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Full Name</h3>
                            <p>{userInfo.fullName || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Birth</h3>
                            <p>{formatDate(userInfo.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Age</h3>
                            <p>{getAge(userInfo.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Registration Id</h3>
                            <p>{userInfo.registrationId || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Email</h3>
                            <p>{userInfo.email || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>State of origin</h3>
                            <p>{userInfo.stateOfOrigin || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Phone Number</h3>
                            <p>{userInfo.phone || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Gender</h3>
                            <p>{userInfo.gender || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Department</h3>
                            <p>{userInfo.department || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date Employed</h3>
                            <p>{formatDate(userInfo.dateEmployed)}</p>
                        </div>
                    </div>
                </div>
                {window.innerWidth < 768 && (
                    <div>
                        <Link to='/lecturer/courses'
                            className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                            <img src="/images/courses.svg" alt="courses"
                                className="w-6 h-6" />
                            <p>Courses</p>
                        </Link>
                        <Link to='/lecturer/results'
                            className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                            <img src="/images/result.svg" alt="results"
                                className="w-6 h-6" />
                            <p>Results</p>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full  rounded-2xl p-4 shadow-md hover:cursor-pointer hover:opacity-0.8 transition-all duration-200 ease-in-out " >
                            <p>Logout</p>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}