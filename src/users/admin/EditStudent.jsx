import { useState, useEffect } from "react"
import States from '../../../cacheInfo.json'
import { editStudent, studentProfile } from "../../api/adminApi";
import Toast from "../../components/Toast";
import Loading from '../../components/Loaidng'
import { useNavigate, useParams } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function EditStudent(){
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        matricNo: '',
        currentLevel: '',
        currentSemester: '',
        currentSession: '',
        stateOfOrigin: '',
        department: '',
        dateOfBirth: '',
        profilePic: '',
        phone: '',
        yearOfAdmission: '',
        yearOfGraduation: '',
        gender: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function updateUserInfo(field, value){
        setUserInfo((prev) => ({
            ...prev, [field]: value
        }))
    };
    const userId = useParams().id;
    useEffect(() => {
        async function GetExistingProfile(userId) {
            try{
                const res = await studentProfile(userId);
                setUserInfo(res.data.student)
            }catch(err){
                handleApiError(err, setError, "An unexpected error occuured")
            }
        }
        GetExistingProfile(userId)
    },[userId])
    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet');
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
            await editStudent(payload);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        } finally {
            setLoading(false);
        }
    }

    const states = States['States'];
    return(
        <div className="flex flex-col max-w-md mx-auto">
            {loading && <Loading />}
            {error && <Toast text={error} color={'red'} />}
            <div className="flex items-center justify-start gap-4">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-6 h-6" 
                    onClick={() => navigate(-1)} 
                />
                <h3 className="text-3xl font-bold">Edit student</h3>
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
                            <label htmlFor="matricNo">
                                <p>Matric Number</p>
                            </label>
                            <input type="text"
                                className="bg-gray-200 p-2 rounded-xl " 
                                placeholder="Enter iD i.e CSC/23/38992"
                                maxLength={12}
                                value={userInfo.matricNo}
                                onChange={(e) => updateUserInfo('matricNo', e.target.value)}/>
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
                            <label htmlFor="yearOfAdmission">
                                <p>Year of admission</p>
                            </label>
                            <input type="text" 
                                className="bg-gray-200 p-2 rounded-xl "
                                placeholder="2024"
                                maxLength={4}
                                minLength={4}
                                value={userInfo.yearOfAdmission}
                                onChange={(e) => updateUserInfo('yearOfAdmission', e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 ">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label htmlFor="profilePic">
                                <p>Profile picture</p>
                            </label>
                            {imagePreview ? (
                                <div>
                                    <img src={imagePreview} alt="image preview" className="w-20 h-20 object-cover rounded-full mb-2" />
                                </div>
                            ) : userInfo.profilePic ? (
                                <div>
                                    <img src={userInfo.profilePic} alt="profile" className="w-20 h-20 object-cover rounded-full mb-2" />
                                </div>
                            ) : null}
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
                    <button className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl" type="submit">
                        <p>Edit Student</p>
                    </button>
                </form>
            </div>
        </div>
    )
}