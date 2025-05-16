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
export const getCoursesTaking = async(courseCode) => 
    lecturerApi.get(`/lecturer/courses-taking/${courseCode}`, {params: {courseCode}})
export const getCourse = async(courseCode) => 
    lecturerApi.get(`/lecturer/courses-taking/${courseCode}`, {params : {courseId}})
export const getRegisteredStudents = async(courseCode) =>
    lecturerApi.get(`/lecturer/registered-students/${courseCode}`)
export const getCourseResult = async(courseCode, lecturerId) => 
    lecturerApi.get(`/lecturer/results/${lecturerId}`, {params: {lecturerId}}, courseCode)
export const editResult = async(lecturerId, data) => 
    lecturerApi.put(`/lecturer/result/${lecturerId}`, data)
export const uploadResult = async(lecturerId, results) => 
    lecturerApi.post(`/lecturer/result/${lecturerId}`, results)

export default lecturerApi;