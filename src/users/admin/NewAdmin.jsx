import { useState } from "react"
import States from '../../../cacheInfo.json'
import { newAdmin } from "../../api/adminApi";
import Loading from '../../components/Loaidng'
import Toast from '../../components/Toast'
import {useNavigate} from 'react-router-dom'
import handleApiError from "../../utils/HandleAPIERROR";

export default function NewAdmin(){
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        adminId: '',
        dateOfBirth: '',
        dateOfEmployment: '',
        stateOfOrigin: '',
        phone: '',
        gender: '',
        profilePic: '',
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

    const states = States['States'];

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
            await newAdmin({adminInfo : payload});
            navigate('/admin')
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="flex flex-col max-w-md mx-auto">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="flex items-center justify-start gap-4">
                <img src="/images/back-button.svg" className="md:hidden w-6 h-6" 
                    onClick={() => navigate(-1)}/>
                <h3 className="text-3xl font-bold">New Admin</h3>
            </div>
            <div>
                <form className="flex flex-col gap-3 py-4" onSubmit={handleSubmit}>
                    <label htmlFor="fullname">
                        <p>Full Name</p>
                    </label>
                    <input 
                        required
                        type="text"
                        className="bg-gray-200 p-2 rounded-xl "
                        placeholder="Enter your full name" 
                        value={userInfo.fullName}
                        onChange={(e) => updateUserInfo('fullName', e.target.value)}/>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="email">
                                <p>Email</p>
                            </label>
                            <input 
                                required
                                type="text" 
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
                                type="text" placeholder="Enter your phone number: Without +234" 
                                className="bg-gray-200 p-2 rounded-xl "
                                maxLength={11}
                                value={userInfo.phone}
                                onChange={(e) => updateUserInfo('phone', e.target.value)}/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="adminId">
                                <p>Admin ID</p>
                            </label>
                            <input 
                                required
                                type="text"
                                className="bg-gray-200 p-2 rounded-xl " 
                                placeholder="Enter iD i.e ADCB/2345"
                                value={userInfo.adminId}
                                onChange={(e) => updateUserInfo('adminId', e.target.value)}/>
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
                            <label htmlFor="dateOfEmployment">
                                <p>Date Of Employment</p>
                            </label>
                            <input 
                                required
                                type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                value={userInfo.dateOfEmployment}
                                onChange={(e) => updateUserInfo('dateOfEmployment', e.target.value)}/>
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
                                className="hidden"
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
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl" type="submit">
                        <p>Create new Admin</p>
                    </button>
                </form>
            </div>
        </div>
    )
}