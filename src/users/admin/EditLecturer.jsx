import { useState, useEffect } from "react"
import States from '../../../cacheInfo.json'
import Courses from '../../../allCourses.json'
import { editLecturer, lecturerProfile } from "../../api/adminApi";
import { useParams } from 'react-router-dom'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { useNavigate } from "react-router-dom";

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
            } catch (error) {
                setError(error.message);
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

    function handleCoursesChange(e) {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        updateUserInfo('coursesTaking', selected);
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
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="flex flex-col p-4 max-w-md mx-auto">
            {error && <Toast text={error} color={'red'} /> }
            {loading && <Loading />}
            <p className="font-bold text-3xl mb-3">Edit Lecturer</p>
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
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label>
                                <p>Courses</p>
                            </label>
                            <select 
                                className="bg-gray-200 p-2 rounded-xl "
                                multiple
                                value={userInfo.coursesTaking}
                                onChange={handleCoursesChange}>
                                    {Courses.map((course) => (
                                        <option value={course.code} key={course.code}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
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
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl">
                        <p>Edit Profile</p>
                    </button>
                </form>
            </div>
        </div>
    )
}