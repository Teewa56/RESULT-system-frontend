import { useState } from "react";
import States from "../../../cacheInfo.json";
import { newStudent } from "../../api/adminApi";
import Loading from "../../components/Loaidng";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function NewStudent() {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    matricNo: "",
    currentLevel: "",
    currentSemester: "",
    currentSession: "",
    stateOfOrigin: "",
    department: "",
    dateOfBirth: "",
    profilePic: "",
    phone: "",
    yearOfAdmission: "",
    yearOfGraduation: "",
    gender: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const departments = States['Departments'];
  function updateUserInfo(field, value) {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function uploadToCloudinary(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "pymeet");
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
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
      await newStudent({ studentInfo: payload });
      navigate("/admin");
    } catch (err) {
      handleApiError(err, setError, "An unexpected error occuured")
    } finally {
      setLoading(false);
    }
  }

  const states = States["States"];

  return (
    <div className="flex flex-col max-w-md mx-auto">
      {loading && <Loading />}
      {error && <Toast text={error} color="red" />}
      <div className='flex items-center justify-start gap-2'>
            <img src="/images/back-button.svg" className="md:hidden w-6 h-6" 
                onClick={() => navigate(-1)}/>
            <h3 className='text-2xl font-bold'>New Student</h3>
        </div>
      <form className="flex flex-col gap-3 py-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <label htmlFor="fullName">
          <p>Full Name</p>
        </label>
        <input
          type="text"
          id="fullName"
          className="bg-gray-200 p-2 rounded-xl"
          placeholder="Enter your full name"
          value={userInfo.fullName}
          onChange={(e) => updateUserInfo("fullName", e.target.value)}
        />

        {/* Email & Gender */}
        <div className="flex gap-2">
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="email">
              <p>Email</p>
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="Enter your email"
              value={userInfo.email}
              onChange={(e) => updateUserInfo("email", e.target.value)}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="gender">
              <p>Gender</p>
            </label>
            <select
              id="gender"
              className="bg-gray-200 p-2 rounded-xl"
              value={userInfo.gender}
              onChange={(e) => updateUserInfo("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Phone & Matric No */}
        <div className="flex gap-2">
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="phone">
              <p>Phone Number</p>
            </label>
            <input
              type="text"
              id="phone"
              maxLength={11}
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="08012345678"
              value={userInfo.phone}
              onChange={(e) => updateUserInfo("phone", e.target.value)}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="matricNo">
              <p>Matric Number</p>
            </label>
            <input
              type="text"
              id="matricNo"
              maxLength={15}
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="CSC/23/XXXX"
              value={userInfo.matricNo}
              onChange={(e) => updateUserInfo("matricNo", e.target.value)}
            />
          </div>
        </div>

        {/* Date of Birth & Year of Admission */}
        <div className="flex gap-2">
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="dateOfBirth">
              <p>Date of Birth</p>
            </label>
            <input
              type="text"
              id="dateOfBirth"
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="DD/MM/YYYY"
              value={userInfo.dateOfBirth}
              onChange={(e) => updateUserInfo("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="yearOfAdmission">
              <p>Year of Admission</p>
            </label>
            <input
              type="text"
              id="yearOfAdmission"
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="2022"
              maxLength={4}
              value={userInfo.yearOfAdmission}
              onChange={(e) => updateUserInfo("yearOfAdmission", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
            <div className="w-1/2 flex flex-col gap-2">
                <label htmlFor="yearOfGraduation">
                    <p>Year of Graduation</p>
                </label>
                <input
                    type="text"
                    id="yearOfGraduation"
                    className="bg-gray-200 p-2 rounded-xl"
                    placeholder="2026"
                    maxLength={4}
                    value={userInfo.yearOfGraduation}
                    onChange={(e) => updateUserInfo("yearOfGraduation", e.target.value)}
                />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
                <label htmlFor="department">
                    <p>Department</p>
                </label>
                <select 
                className="bg-gray-200 rounded-2xl p-2 "
                  value={userInfo.department}
                  onChange={(e) => updateUserInfo('department', e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option value={dept} key={dept}>{dept}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Profile Picture & State of Origin */}
        <div className="flex gap-2">
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="profilePic"
                className="px-4 cursor-pointer py-2 rounded-2xl bg-blue-400">
                <p>Choose Profile picture</p>
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-20 h-20 object-cover rounded-full"
              />
            )}
            <input
              type="file"
              className="hidden"
              id="profilePic"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="stateOfOrigin">
              <p>State of Origin</p>
            </label>
            <select
              id="stateOfOrigin"
              className="bg-gray-200 p-2 rounded-xl"
              value={userInfo.stateOfOrigin}
              onChange={(e) => updateUserInfo("stateOfOrigin", e.target.value)}
            >
              <option value="">Choose State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Level & Semester */}
        <div className="flex gap-2">
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="currentLevel">
              <p>Current Level</p>
            </label>
            <input
              type="text"
              id="currentLevel"
              className="bg-gray-200 p-2 rounded-xl"
              placeholder="e.g. 300 Level"
              value={userInfo.currentLevel}
              onChange={(e) => updateUserInfo("currentLevel", e.target.value)}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <label htmlFor="currentSemester">
              <p>Current Semester</p>
            </label>
            <select
              id="currentSemester"
              className="bg-gray-200 p-2 rounded-xl"
              value={userInfo.currentSemester}
              onChange={(e) => updateUserInfo("currentSemester", e.target.value)}
            >
              <option value="">Select Semester</option>
              <option value="First Semester">First</option>
              <option value="Second Semester">Second</option>
            </select>
          </div>
        </div>

        {/* Current Session */}
        <div>
          <label htmlFor="currentSession">
            <p>Current Session</p>
          </label>
          <input
            type="text"
            id="currentSession"
            className="bg-gray-200 p-2 rounded-xl"
            placeholder="e.g. 2024/2025"
            value={userInfo.currentSession}
            onChange={(e) => updateUserInfo("currentSession", e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className="border-2 w-fit mx-auto px-4 py-2 rounded-2xl hover:bg-gray-300 transition"
          type="submit"
        >
          <p>Create New Student</p>
        </button>
      </form>
    </div>
  );
}
