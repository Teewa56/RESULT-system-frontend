import { useState, useEffect } from "react"
import States from '../../../cacheInfo.json'
import Courses from '../../../allCourses.json'
import { editLecturer, lecturerProfile } from "../../api/adminApi";
import { useParams } from 'react-router-dom'
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function EditLecturer(){
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        registrationId: '',
        stateOfOrigin: '',
        department: '',
        dateOfBirth: '',
        profilePic: '',
        phone: '',
        dateEmployed: '',
        gender: '',
        coursesTaking: []
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const userId = useParams().id;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function getLecturerProfile(params){
            try {
                setLoading(true);
                const res = await lecturerProfile(params);
                setUserInfo(res.data.lecturer);
                setImagePreview(res.data.lecturer.profilePic || '');
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        getLecturerProfile(userId)
    }, [userId])

    const states = States['States'];
    const Departments = States['Departments'];

    function updateUserInfo(field, value){
        setUserInfo((prev) => ({
            ...prev, [field]: value
        }))
    };

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet' ); 
        data.append("cloud_name", import.meta.env.CLOUDINARY_CLOUD_NAME); 

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data
        });
        const result = await res.json();
        return result.secure_url;
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    // New function to handle checkbox selection for courses
    function handleCourseCheckboxChange(courseCode) {
        setUserInfo(prev => {
            const coursesTaking = [...prev.coursesTaking];
            
            // If course is already selected, remove it; otherwise, add it
            if (coursesTaking.includes(courseCode)) {
                return {
                    ...prev,
                    coursesTaking: coursesTaking.filter(code => code !== courseCode)
                };
            } else {
                return {
                    ...prev,
                    coursesTaking: [...coursesTaking, courseCode]
                };
            }
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let profilePicUrl = userInfo.profilePic;
            if (imageFile) {
                profilePicUrl = await uploadToCloudinary(imageFile);
            }
            const payload = { ...userInfo, profilePic: profilePicUrl };
            await editLecturer(payload, userId);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        } finally {
            setLoading(false);
        }
    }

    // Filter courses based on search term
    const filteredCourses = searchTerm 
        ? Courses.filter(course => 
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : Courses;

    return(
        <div className="flex flex-col max-w-md mx-auto">
            {error && <Toast text={error} color={'red'} /> }
            {loading && <Loading />}
            <div className="flex items-center justify-start gap-4">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-6 h-6" 
                    onClick={() => navigate(-1)} 
                />
                <h3 className="text-3xl font-bold">Edit Lecturer</h3>
            </div>
            <div>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label htmlFor="fullname">
                        <p>Full Name</p>
                    </label>
                    <input type="text"
                        className="bg-gray-200 p-2 rounded-xl "
                        placeholder="Enter your full name" 
                        value={userInfo.fullName}
                        onChange={(e) => updateUserInfo('fullName', e.target.value)}/>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="email">
                                <p>Email</p>
                            </label>
                            <input type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="Enter your email here"
                                value={userInfo.email}
                                onChange={(e) => updateUserInfo('email', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="gender">
                                <p>Gender</p>
                            </label>
                            <select 
                                className="bg-gray-200 p-2 rounded-xl "
                                value={userInfo.gender}
                                onChange={(e) => updateUserInfo('gender', e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="phoneNumber">
                                <p>Phone Number</p>
                            </label>
                            <input type="text" placeholder="Enter your phone number: Without +234" 
                                className="bg-gray-200 p-2 rounded-xl "
                                maxLength={11}
                                value={userInfo.phone}
                                onChange={(e) => updateUserInfo('phone', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="registrationId">
                                <p>Registration ID</p>
                            </label>
                            <input type="text"
                                className="bg-gray-200 p-2 rounded-xl " 
                                placeholder="Enter iD i.e ADCB/2345"
                                maxLength={7}
                                value={userInfo.registrationId}
                                onChange={(e) => updateUserInfo('registrationId', e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="dateOfBirth">
                                <p>Date Of Birth</p>
                            </label>
                            <input type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                value={userInfo.dateOfBirth}
                                onChange={(e) => updateUserInfo('dateOfBirth', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="dateEmployed">
                                <p>Date Of Employment</p>
                            </label>
                            <input type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                value={userInfo.dateEmployed}
                                onChange={(e) => updateUserInfo('dateEmployed', e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="profilePic">
                                <p>Profile picture</p>
                            </label>
                            {imagePreview && (
                                <div>
                                    <img src={imagePreview} alt="image preview" className="w-20 h-20 object-cover rounded-full mb-2" />
                                </div>
                            )}
                            <input type="file" 
                                id="profilePic"
                                accept="image/*"
                                onChange={handleImageChange}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="stateOfOrigin">
                                <p>State of Origin</p>
                            </label>
                            <select 
                                className="bg-gray-200 p-2 rounded-xl "
                                value={userInfo.stateOfOrigin}
                                onChange={(e) => updateUserInfo('stateOfOrigin', e.target.value)}>
                                    <option value="">Choose State</option>
                                    {states.map((state) => (
                                        <option value={state} key={state}>{state}</option>
                                    ))}
                                </select>
                        </div>
                    </div>
                    
                    {/* Course Selection with Checkboxes */}
                    <div className="flex flex-col gap-2 mt-2">
                        <label>
                            <p>Select Courses</p>
                        </label>
                        
                        {/* Search input for filtering courses */}
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="bg-gray-200 p-2 rounded-xl w-full pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 absolute left-2 top-2.5 text-gray-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                        </div>
                        
                        {/* Selected course count */}
                        <div className="text-sm text-gray-600 mb-1">
                            Selected: {userInfo.coursesTaking.length} courses
                        </div>
                        
                        {/* Courses list with checkboxes */}
                        <div className="bg-gray-100 p-3 rounded-xl max-h-60 overflow-y-auto">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div 
                                        key={course.code}
                                        className="flex items-center py-1.5 px-2 hover:bg-gray-200 rounded-md transition-colors duration-150"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`course-${course.code}`}
                                            checked={userInfo.coursesTaking.includes(course.code)}
                                            onChange={() => handleCourseCheckboxChange(course.code)}
                                            className="w-4 h-4 mr-3"
                                        />
                                        <label 
                                            htmlFor={`course-${course.code}`}
                                            className="flex-1 cursor-pointer text-sm"
                                        >
                                            <span className="font-medium">{course.code}</span> - {course.title}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-4 text-gray-500">No courses match your search</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="w-full flex flex-col gap-2">
                            <label>
                                <p>Department</p>
                            </label>
                            <select 
                                className="bg-gray-200 p-2 rounded-xl "
                                value={userInfo.department}
                                onChange={(e) => updateUserInfo('department', e.target.value)}>
                                    <option value="">Choose Department</option>
                                    {Departments.map((department) => (
                                        <option value={department} key={department}>{department}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 mt-3">
                        <p>Edit Profile</p>
                    </button>
                </form>
            </div>
        </div>
    )
}