import axios from 'axios';

const apiURL = import.meta.env.DEPLOYED_BACKEND_URL || 'http://localhost:5000/api' ;
const studentApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInStudent = async(data) => 
    studentApi.post(`/student/signIn`, data);
export const logoutStudent = async() =>
    studentApi.post('/student/logout')
export const studentProfile = async(id) => 
    studentApi.get(`/student/profile/${id}`, {params: {id}})
export const registeredCourses = async(id) => 
    studentApi.get(`/student/registeredCourses/${id}`, {params: {id}})
export const carryOverCourses = async(id) => 
    studentApi.get(`/student/carryOverCourses/${id}`)
export const allResults  = async(id) => 
    studentApi.get(`/student/results/${id}`, {params: {id}})
export const getResult = async(id, data) => 
    studentApi.get(`/student/result/${id}`, {params: {id}}, data)
export const getGpa = async(id, data) => 
    studentApi.get(`/student/gpa/${id}`, {params: {id}}, data)

export default studentApi;