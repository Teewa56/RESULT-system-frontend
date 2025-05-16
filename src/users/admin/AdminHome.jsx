import ThemeToggle from '../../components/ThemeToggle'
import { Link } from 'react-router-dom'
import { adminProfile } from '../../api/adminApi'
import { useEffect, useState, useContext } from 'react'
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { AuthContext } from '../../context/AuthContext'

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

export default function AdminHome() {
    const [userInfo, setUserInfo] = useState({});
    const [Error, setError] = useState('');
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const { LogOut, error } = useContext(AuthContext);

    const handleLogout = async () => {
        await LogOut();
    }

    useEffect(() => {
        async function getUserInfo(userId) {
            try {
                setLoading(true)
                const res = await adminProfile(userId);
                setUserInfo(res.data.admin)
            } catch (error) {
                console.log('Error: ', error.message);
                setError(error.message);
            } finally {
                setLoading(false)
            }
        }
        getUserInfo(userId)
    }, [userId]);

    if (error) {
        setError(error);
    }

    return (
        <div>
            {loading && <Loading />}
            {Error && <Toast text={Error} color={'red'} />}
            <div className='flex items-center justify-between mb-5'>
                <h3 className='text-2xl'>Admin Profile</h3>
                <ThemeToggle />
            </div>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full'>
                <div className={`${window.innerWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img
                        src={userInfo.profilePic}
                        alt="profile"
                        className='w-full h-full rounded-3xl object-cover'
                    />
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
                            <h3 className='font-bold'>Admin Id</h3>
                            <p>{userInfo.adminId || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Admin Password</h3>
                            <p className='flex items-center justify-between gap-4'>
                                {userInfo.normalPassword ? '*'.repeat(userInfo.normalPassword.length) : ""}
                                <span>eye</span>
                            </p>
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
                    </div>
                </div>
            </div>
            <div className='pt-4'>
                <h3 className='font-bold text-2xl'>Others</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 mt-2 gap-2'>
                    <Link to='/admin/updatesemster'
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12' />
                        <p>Update Semester</p>
                    </Link>
                    <Link to='/admin/profiles'
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12' />
                        <p>Profiles</p>
                    </Link>
                    <Link to={`/admin/editAdmin/${localStorage.getItem('userId')}`}
                        className='p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer'>
                        <img src="/images/courses.svg" alt=""
                            className='w-12 h-12' />
                        <p>Edit Profile</p>
                    </Link>
                    {window.innerWidth < 786 &&
                        <>
                            <Link to="/admin/courses"
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer">
                                <img src="/images/courses.svg" alt="courses"
                                    className="w-12 h-12" />
                                <p>Courses</p>
                            </Link>
                            <Link to='/admin/newStudent'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer">
                                <img src="/images/newUser.svg" alt="newStudent"
                                    className="w-12 h-12" />
                                <p>New Student</p>
                            </Link>
                            <Link to='/admin/newLecturer'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer">
                                <img src="/images/newUser.svg" alt="newInstructor"
                                    className="w-12 h-12" />
                                <p>New Lecturer</p>
                            </Link>
                            <Link to='/admin/newAdmin'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer">
                                <img src="/images/newUser.svg" alt="newAdmin"
                                    className="w-12 h-12" />
                                <p>New Admin</p>
                            </Link>
                            <Link to='/admin/result'
                                className="p-4 shadow-lg border-2 rounded-3xl flex flex-col items-center hover:cursor-pointer">
                                <img src="/images/result.svg" alt="results"
                                    className="w-12 h-12" />
                                <p>Results</p>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full  rounded-2xl p-4 shadow-md hover:cursor-pointer hover:opacity-0.8 transition-all duration-200 ease-in-out " >
                                <p>Logout</p>
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}