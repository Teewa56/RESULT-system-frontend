import axios from 'axios';

//const deployURL = 'https://result-system-backend.onrender.com/api';
const localURL = 'http://localhost:5000/api';
const apiURL = /*deployURL || */localURL;

const studentApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInStudent = async(data) => {
    return studentApi.post(`/student/signIn`, data);
}
export const logoutStudent = async() => {
    return studentApi.post('/student/logout')
}
export const studentProfile = async(id) => {
    return studentApi.get(`/student/profile/${id}`)
}
export const registeredCourses = async(id) => {
    return studentApi.get(`/student/profile/registered-courses/${id}`)
}
export const carryOverCourses = async(id) => {
    return studentApi.get(`/student/carryOverCourses/${id}`)
}
export const allResults  = async(id) => {
    return studentApi.get(`/student/results/${id}`)
}
export const getResult = async(id, data) => {
    return studentApi.post(`/student/result/${id}`, data)
}
export const getGpa = async(id) => {
    return studentApi.get(`/student/gpa/${id}`)
}
export default studentApi;