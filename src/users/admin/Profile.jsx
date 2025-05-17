import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { studentProfile, lecturerProfile, adminProfile } from "../../api/adminApi";
import Toast from "../../components/Toast";
import Loading from "../../components/Loaidng";
import {useNavigate} from 'react-router-dom'
import handleApiError from "../../utils/HandleAPIERROR";

export default function Profile(){
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = useParams().id;
    const current = Number(localStorage.getItem('current'));
    const navigate = useNavigate();
    useEffect(() => {
        async function GetUserInfo(id) {
            setLoading(true);
            try{
                if(current === 1){
                    const res = await studentProfile(id);
                    setUserInfo(res.data.student)
                }
                if(current === 2){
                    const res = await lecturerProfile(id);
                    setUserInfo(res.data.lecturer)
                }
                if(current === 3){
                    const res = await adminProfile(id);
                    setUserInfo(res.data.admin)
                }
            }catch(err){
                handleApiError(err, setError, "An unexpected error occuured")
            }finally{
                setLoading(false);
            }
        }
        GetUserInfo(userId);
    }, [userId, current]);

    function formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d)) return date; 
        return d.toLocaleDateString();
    }

    function maskPassword(pwd) {
        if (!pwd) return "";
        return "*".repeat(pwd.length);
    }
    const profilePic = userInfo.profilePic;

    return(
        <div className="w-full">
            {loading && <Loading />}
            {error && <Toast text={error} color={'red'} />}
            <div className="flex items-center justify-start gap-4">
                <img src="/images/back-button.svg" className="md:hidden w-6 h-6" 
                    onClick={() => navigate(-1)}/>
                <h3 className="text-3xl font-bold">Profile</h3>
            </div>
            {current === 1 && userInfo &&
            <>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full mt-4'>
                <div className={`${window.innerWidth < 786 ? 'w-full' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img src={profilePic} alt="profile" className='w-full h-full rounded-3xl object-cover' />
                </div>
                <div className = {`${window.innerWidth < 786 ? 'w-full' : 'w-3/4'}`}>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-2'>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Full Name</h3>
                            <p>{userInfo.fullName}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Birth</h3>
                            <p>{formatDate(userInfo.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Matric No</h3>
                            <p>{userInfo.matricNo}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Level</h3>
                            <p>{userInfo.currentLevel}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Semester</h3>
                            <p>{userInfo.currentSemester}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Current Session</h3>
                            <p>{userInfo.currentSession}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Email</h3>
                            <p>{userInfo.email}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>State of Origin</h3>
                            <p>{userInfo.stateOfOrigin}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Phone Number</h3>
                            <p>{userInfo.phone}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Year of Admission</h3>
                            <p>{userInfo.yearOfAdmission}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Year of Graduation</h3>
                            <p>{userInfo.yearOfGraduation}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>CGPA</h3>
                            <p>{userInfo.cgpa}</p>
                        </div>
                    </div> 
                </div>
            </div>
            <Link 
                to={`/admin/editStudent/${userId}`}
                className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-600 transition duration-300 ease-in-out text-center"
                >
                <p>Edit Profile</p>
            </Link>
            </>
            }
            {current === 2 && userInfo &&
            <>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full mt-4'>
                <div className={`${window.innerWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img src={profilePic} alt="profile" className='w-full h-full rounded-3xl object-cover' />
                </div>
                <div className = {`${window.innerWidth < 786 ? 'w-full' : 'w-3/4'}`}>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-1'>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Full Name</h3>
                            <p>{userInfo.fullName}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Birth</h3>
                            <p>{formatDate(userInfo.dateOfBirth)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Registration ID</h3>
                            <p>{userInfo.registrationId}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Department</h3>
                            <p>{userInfo.department}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date Employed</h3>
                            <p>{formatDate(userInfo.dateEmployed)}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Courses Taking</h3>
                            <p>{userInfo.coursesTaking && userInfo.coursesTaking.join(', ')}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Email</h3>
                            <p>{userInfo.email}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>State of Origin</h3>
                            <p>{userInfo.stateOfOrigin}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Phone Number</h3>
                            <p>{userInfo.phone}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Gender</h3>
                            <p>{userInfo.gender}</p>
                        </div>
                    </div> 
                </div>
            </div>
            <Link 
                to={`/admin/editLecturer/${userId}`}
                className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-600 transition duration-300 ease-in-out text-center"
                >
                <p>Edit Profile</p>
            </Link>
            </>
            }
            {current === 3 && userInfo &&
            <>
            <div className='flex flex-col md:flex-row items-start justify-start gap-5 w-full mt-4 mb-2'>
                <div className={`${window.innerWidth < 786 ? 'w-1/3' : 'w-1/4'} h-40 rounded-3xl shadow-lg`}>
                    <img src={profilePic} alt="profile" className='w-full h-full rounded-3xl object-cover' />
                </div>
                <div className = {`${window.innerWidth < 786 ? 'w-full' : 'w-3/4'}`}>
                    <div className='grid grid-cols-2  md:grid-cols-3 gap-5 mt-1'>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Full Name</h3>
                            <p>{userInfo.fullName}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Birth</h3>
                            <p>{userInfo.dateOfBirth}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Admin ID</h3>
                            <p>{userInfo.adminId}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Date of Employment</h3>
                            <p>{userInfo.dateOfEmployment}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Email</h3>
                            <p>{userInfo.email}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>State of Origin</h3>
                            <p>{userInfo.stateOfOrigin}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Phone Number</h3>
                            <p>{userInfo.phone}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Gender</h3>
                            <p>{userInfo.gender}</p>
                        </div>
                        <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>Password</h3>
                            <p className='flex items-center justify-between gap-4'>
                                {maskPassword(userInfo.normalPassword)}
                            </p>
                        </div>
                    </div> 
                </div>
            </div>
            <Link 
                to={`/admin/editAdmin/${userId}`}
                className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-600 transition duration-300 ease-in-out text-center"
                >
                <p>Edit Profile</p>
            </Link>
            </>
            }
        </div>
    )
}