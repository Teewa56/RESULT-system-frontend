import { useState } from "react"
import States from '../../../cacheInfo.json'
import Courses from '../../../allCourses.json'
import { newLecturer } from "../../api/adminApi";
import Loading from '../../components/Loaidng'
import Toast from '../../components/Toast'
import { useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function NewLecturer(){
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    function updateUserInfo(field, value){
        setUserInfo((prev) => ({
            ...prev, [field]: value
        }))
    };

    function handleCourseToggle(courseCode) {
        setUserInfo(prev => {
            const currentCourses = [...prev.coursesTaking];
            if (currentCourses.includes(courseCode)) {
                return {
                    ...prev,
                    coursesTaking: currentCourses.filter(code => code !== courseCode)
                };
            } else {
                return {
                    ...prev,
                    coursesTaking: [...currentCourses, courseCode]
                };
            }
        });
    }

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet');
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
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

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let profilePicUrl = userInfo.profilePic;
            if (imageFile) {
                profilePicUrl = await uploadToCloudinary(imageFile);
            }
            const payload = { ...userInfo, profilePic: profilePicUrl };
            await newLecturer({lecturerInfo: payload});
            navigate('/admin')
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        } finally {
            setLoading(false);
        }
    }

    const states = States['States'];
    const Departments = States['Departments'];

    return(
        <div className="flex flex-col max-w-md mx-auto">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="flex items-center justify-start gap-4">
                <img src="/images/back-button.svg" className="md:hidden w-6 h-6" 
                    onClick={() => navigate(-1)}/>
                <h3 className="text-3xl font-bold">New Lecturer</h3>
            </div>
            <div>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label htmlFor="fullname">
                        <p>Full Name</p>
                    </label>
                    <input type="text"
                        required
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
                                required
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
                                required
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
                            <input 
                                required
                                type="text" 
                                placeholder="Enter your phone number: Without +234" 
                                className="bg-gray-200 p-2 rounded-xl "
                                maxLength={11}
                                value={userInfo.phone}
                                onChange={(e) => updateUserInfo('phone', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="registrationId">
                                <p>Registration ID</p>
                            </label>
                            <input 
                                required
                                type="text"
                                className="bg-gray-200 p-2 rounded-xl " 
                                placeholder="Enter iD i.e ADCB/2345"
                                value={userInfo.registrationId}
                                onChange={(e) => updateUserInfo('registrationId', e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="dateOfBirth">
                                <p>Date Of Birth</p>
                            </label>
                            <input 
                                required
                                type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                value={userInfo.dateOfBirth}
                                onChange={(e) => updateUserInfo('dateOfBirth', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="dateEmployed">
                                <p>Date Of Employment</p>
                            </label>
                            <input 
                                required
                                type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                value={userInfo.dateEmployed}
                                onChange={(e) => updateUserInfo('dateEmployed', e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="profilePic"
                                className="px-4 cursor-pointer py-2 rounded-2xl bg-blue-400">
                                <p>Choose Profile picture</p>
                            </label>
                            {imagePreview && (
                                <div>
                                    <img src={imagePreview} alt="image preview" className="w-20 h-20 object-cover rounded-full mb-2" />
                                </div>
                            )}
                            <input 
                                required
                                type="file" 
                                id="profilePic"
                                accept="image/*"
                                onChange={handleImageChange}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="stateOfOrigin">
                                <p>State of Origin</p>
                            </label>
                            <select 
                                required
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
                    <div className="flex justify-between gap-2">
                        <div className="w-full flex flex-col gap-2">
                            <label>
                                <p>Department</p>
                            </label>
                            <select 
                                required
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
                    <div className="flex flex-col gap-2">
                        <label>
                            <p>Courses Taking</p>
                        </label>
                        <div className="bg-gray-100 p-3 rounded-xl max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                                {Courses.map((course) => (
                                    <div key={course.code} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`course-${course.code}`}
                                            checked={userInfo.coursesTaking.includes(course.code)}
                                            onChange={() => handleCourseToggle(course.code)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`course-${course.code}`} className="text-sm">
                                            {course.code}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {userInfo.coursesTaking.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium">Selected Courses ({userInfo.coursesTaking.length}):</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {userInfo.coursesTaking.map(code => (
                                        <span key={code} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl" type="submit">
                        <p>Create new Lecturer</p>
                    </button>
                </form>
            </div>
        </div>
    )
}