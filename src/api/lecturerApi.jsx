import axios from 'axios';

const apiURL = import.meta.env.DEPLOYED_BACKEND_URL || 'http://localhost:5000/api' ;
const lecturerApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInLecturer = async(data) => 
    lecturerApi.post('/lecturer/signIn', data)
export const logoutLecturer = async() =>
    lecturerApi.post('/lecturer/logout')
export const lecturerProfile = async(id) => 
    lecturerApi.get(`/lecturer/profile/${id}`, {params: {id}})
export const getCoursesTaking = async(id) => 
    lecturerApi.get(`/lecturer/courses-taking/${id}`, {params: {id}})
export const getCourse = async(courseId) => 
    lecturerApi.get(`/lecturer/courses-taking/${courseId}`, {params : {courseId}})
export const getCourseResult = async(courseId, lecturerId) => 
    lecturerApi.get(`/lecturer/results/${lecturerId}/${courseId}`, {params: {courseId, lecturerId}} )
export const editResult = async(lecturerId, studentId, courseCode, data) => 
    lecturerApi.put(`/lecturer/result/${lecturerId}/${studentId}/${courseCode}`, data)
export const uploadResult = async(lecturerId, results) => 
    lecturerApi.post(`/lecturer/result/${lecturerId}`, results)

export default lecturerApi;