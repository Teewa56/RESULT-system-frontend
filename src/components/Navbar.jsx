import { Link } from "react-router-dom"
import { useContext } from "react";
import {AuthContext} from '../context/AuthContext';
import Toast from '../components/Toast';

const Navbar = () => {
    const userType = localStorage.getItem('userType');
    const {LogOut, error} = useContext(AuthContext);
    const handleLogout = async () => {
        await LogOut();  
    }
    return (
        <div className="h-screen w-1/4 rounded-2xl p-4">
            {error && <Toast text={error} color='red' /> }
            <nav className="flex w-full flex-col h-full">
                <div className="flex flex-col border-b-4 mb-4">
                    <h3 className="font-bold text-2xl">RMS</h3> 
                    <p className="text-xl">{userType.toUpperCase()} panel</p>
                </div>
                <Link to={`/${userType}`}
                    className="flex justify-start shadow-md rounded-2xl p-2 mt-4 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                    <img src="/images/profile.svg" alt="profile" 
                        className="w-6 h-6"/>
                    <p>Dashboard</p>
                </Link>
                {userType === 'admin' && (
                    <>
                    <Link to="/admin/courses"
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/courses.svg" alt="courses" 
                            className="w-6 h-6"/>
                        <p>Courses</p>
                    </Link>
                    <Link to='/admin/newStudent'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/newUser.svg" alt="newStudent" 
                            className="w-7 h-7"/>
                        <p>New Student</p>
                    </Link>
                    <Link to='/admin/newLecturer'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/newUser.svg" alt="newInstructor" 
                            className="w-7 h-7"/>
                        <p>New Lecturer</p>
                    </Link>
                    <Link to='/admin/newAdmin'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/newUser.svg" alt="newAdmin" 
                            className="w-7 h-7"/>
                        <p>New Admin</p>
                    </Link>
                    <Link to='/admin/result'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/result.svg" alt="results" 
                            className="w-6 h-6"/>
                        <p>Results</p>
                    </Link>
                    </>
                )}
                {userType === 'lecturer' && (
                    <>
                    <Link to='/lecturer/courses'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/courses.svg" alt="courses" 
                            className="w-6 h-6"/>
                        <p>Courses</p>
                    </Link>
                    <Link to='/lecturer/results'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/result.svg" alt="results" 
                            className="w-6 h-6"/>
                        <p>Results</p>
                    </Link>
                    </>
                )}
                {userType === 'student' && (
                    <>
                    <Link to='/student/registered-courses'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/courses.svg" alt="courses" 
                            className="w-6 h-6"/>
                        <p>Registered Courses</p>
                    </Link>
                    <Link to='/student/carry-over'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/courses.svg" alt="carryover"
                            className="w-6 h-6"/>
                        <p>Carryover Courses</p>                    
                    </Link>
                    <Link to='/student/results'
                        className="flex justify-start shadow-md rounded-2xl p-2 items-center gap-2 hover:opacity-0.8 transition-all duration-200 ease-in-out mb-4">
                        <img src="/images/result.svg" alt="results" 
                            className="w-6 h-6"/>
                        <p>Results</p>
                    </Link>
                    </>
                )}
                <button 
                    onClick={handleLogout}
                    className="w-full rounded-2xl p-4 shadow-md hover:cursor-pointer hover:opacity-0.8 transition-all duration-200 ease-in-out " >
                    <p>Logout</p>
                </button>
            </nav>
        </div>
    )
}

export default Navbar