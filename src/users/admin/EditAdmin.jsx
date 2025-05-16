import { useState, useEffect } from "react"
import States from '../../../cacheInfo.json'
import { editAdmin, adminProfile } from "../../api/adminApi";
import { useParams } from 'react-router-dom'
import Toast from "../../components/Toast";
import Loading from "../../components/Loaidng";
import { useNavigate } from "react-router-dom";

export default function EditAdmin(){
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
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const adminId = useParams().id;
    const navigate = useNavigate();
    useEffect(() => {
        async function getAdminProfile(params) {
            try {
                setLoading(true);
                const res = await adminProfile(params);
                setUserInfo(res.data.admin)
                setImagePreview(res.data.admin.profilePic || '');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getAdminProfile(adminId);
    }, [adminId])

    const states = States['States'];

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

    async function handleImageChange(e) {
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
        setSuccess(null);
        try {
            let profilePicUrl = userInfo.profilePic;
            if (imageFile) {
                profilePicUrl = await uploadToCloudinary(imageFile);
            }
            const payload = { ...userInfo, profilePic: profilePicUrl };
            await editAdmin(adminId, payload);
            setSuccess("Admin updated successfully!");
            navigate('/admin')
        } catch (err) {
            setError(err.message || "Failed to update admin.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="flex flex-col p-4 max-w-md mx-auto">
            {loading && <Loading /> }
            {error && <Toast text={error} color={'red'} /> }
            {success && <Toast text={success} color={'green'} /> }
            <p className="font-bold text-3xl mb-3">Edit Admin</p>
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
                                    <option value="male">Male</option>
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
                            <label htmlFor="admin Id">
                                <p>Admin ID</p>
                            </label>
                            <input type="text"
                                className="bg-gray-200 p-2 rounded-xl " 
                                placeholder="Enter iD i.e ADCB/2345"
                                maxLength={7}
                                value={userInfo.adminId}
                                onChange={(e) => updateUserInfo('adminId', e.target.value)}/>
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
                            <label htmlFor="admin Id">
                                <p>Date Of Employment</p>
                            </label>
                            <input type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="DD/MM/YY"
                                maxLength={7}
                                value={userInfo.dateOfEmployment}
                                onChange={(e) => updateUserInfo('dateOfEmployment', e.target.value)}/>
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
                            <label htmlFor="state of origin">
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
                    {/* ...existing code... */}
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl" type="submit">
                        <p>Edit Admin</p>
                    </button>
                </form>
            </div>
        </div>
    )
}