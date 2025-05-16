import { useState, useEffect, useContext } from "react";
import { studentProfile } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

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

export default function StudentHome() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState('');
    const { LogOut, error } = useContext(AuthContext);
    const userId = localStorage.getItem('userId');

    const handleLogout = async () => {
        await LogOut();
    }

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError('');
            try {
                const res = await studentProfile(userId);
                setProfile(res.data.student);
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
                <h3 className='text-2xl'>Student Profile</h3>
                <ThemeToggle />
            </div>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full'>
                <div className={`${window.innerWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img src={profile.profilePic || "/mypic.png"} alt="profile" className='w-full h-full rounded-3xl object-cover' />
                </div>
                <div className='w-3/4'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-1'>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Full Name</h3>
                            <p>{profile.fullName || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Birth</h3>
                            <p>{formatDate(profile.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Age</h3>
                            <p>{getAge(profile.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Matric No</h3>
                            <p>{profile.matricNo || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Email</h3>
                            <p>{profile.email || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>State of Origin</h3>
                            <p>{profile.stateOfOrigin || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Phone Number</h3>
                            <p>{profile.phone || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Gender</h3>
                            <p>{profile.gender || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Department</h3>
                            <p>{profile.department || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Level</h3>
                            <p>{profile.currentLevel || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Semester</h3>
                            <p>{profile.currentSemester || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Session</h3>
                            <p>{profile.currentSession || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Year of Admission</h3>
                            <p>{profile.yearOfAdmission || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Year of Graduation</h3>
                            <p>{profile.yearOfGraduation || "-"}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>CGPA</h3>
                            <p>{profile.cgpa || "-"}</p>
                        </div>
                    </div>
                </div>
                {window.innerWidth < 768 && (
                    <div>
                        <Link to='/student/registered-courses'
                            className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                            <img src="/images/courses.svg" alt="courses"
                                className="w-6 h-6" />
                            <p>Registered Courses</p>
                        </Link>
                        <Link to='/student/carry-over'
                            className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                            <img src="/images/courses.svg" alt="carry over"
                                className="w-6 h-6" />
                            <p>Carry Over Courses</p>
                        </Link>
                        <Link to='/student/results'
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