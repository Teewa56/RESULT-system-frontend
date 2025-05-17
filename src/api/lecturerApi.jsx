import axios from 'axios';

const apiURL = import.meta.env.DEPLOYED_BACKEND_URL || `http://localhost:5000/api` ;
const lecturerApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInLecturer = async(data) => {
    return lecturerApi.post('/lecturer/signIn', data)
}
export const logoutLecturer = async() => {
    return lecturerApi.post('/lecturer/logout')
}
export const lecturerProfile = async(lecturerId) => {
    return lecturerApi.get(`/lecturer/profile/${lecturerId}`)
}
export const getCoursesTaking = async(lecturerId) => {
    return lecturerApi.get(`/lecturer/courses-taking/${lecturerId}`)
}
export const getCourse = async(courseCode) => {
    return lecturerApi.get(`/lecturer/course-taking/${courseCode}`)
}
export const getRegisteredStudents = async(courseCode) => {
    return lecturerApi.get(`/lecturer/registered-students/${courseCode}`)
}
export const getCourseResult = async (courseCode, lecturerId) => {
    return lecturerApi.get(`/lecturer/results/${lecturerId}?courseCode=${courseCode}`);
}
export const editResult = async(lecturerId, data) => {
    return lecturerApi.put(`/lecturer/result/${lecturerId}`, data)
}
export const uploadResult = async(lecturerId, data) => {
    return lecturerApi.post(`/lecturer/result/${lecturerId}`, data)
}

export default lecturerApi;