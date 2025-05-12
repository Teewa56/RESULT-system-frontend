import axios from 'axios';

const apiURL = import.meta.env.DEPLOYED_BACKEND_URL || `http://localhost:5000/api` ;
const adminApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInAdmin = async(data) => 
    adminApi.post('/admin/signIn', data)
export const adminProfile = async(id) => 
    adminApi.get(`/admin/profile/${id}`, {params : {id}})
export const logoutAdmin = async() => 
    adminApi.post('/admin/logout')
export const editLecturer = async(lecturerInfo, lecturerId) =>
    adminApi.put(`/admin/editLecturer/${lecturerId}`, {params : {lecturerId}} ,lecturerInfo)
export const editStudent = async(studentInfo, studentId) =>
    adminApi.put(`/admin/editStudent/${studentId}`, {params: {studentId}}, studentInfo)
export const editAdmin = async(adminInfo, adminId) => 
    adminApi.put(`/admin/editAdmin/${adminId}`, {params: {adminId}}, adminInfo)
export const newAdmin = async(adminInfo) =>
    adminApi.post(`/admin/newAdmin`, adminInfo)
export const newLecturer = async(lecturerInfo) =>
    adminApi.post('/admin/newLecturer', lecturerInfo)
export const newStudent = async(studentInfo) => 
    adminApi.post('/admin/newStudent', studentInfo)
export const allAdmins = async() => 
    adminApi.get('/admin/allAdmins')
export const alLecturers = async() => 
    adminApi.get('/admin/allLecturers')
export const allStudents = async() =>
    adminApi.get('/admin/allStudents')
export const searchStudent = async(search) =>
    adminApi.get(`/admin/searchStudent/${search}`, {params: {search}})
export const searchLecturer =  async(search) => 
    adminApi.get(`/admin/searchStudent/${search}`, {params: {search}})
export const studentProfile = async(id) =>
    adminApi.get(`/admin/studentProfile/${id}`, {params: {id}})
export const lecturerProfile = async(id) => 
    adminApi.get(`/admin/lecturerProfile/${id}`, {params: {id}})
export const resultPreview = async(data) =>
    adminApi.get('/admin/resultPreview', data)
export const releaseResults = async() =>
    adminApi.post('/admin/releaseResult')
export const closeSubmission = async() =>
    adminApi.post('/admin/closeResultSubmission')
export const getCourseInfo = async(data, courseId) => 
    adminApi.get(`/admin/getCourseInfo/${courseId}`, data, {params: {courseId}})
export const registerCourses = async() =>
    adminApi.post('/registerCourses')
export const updateSemester = async()=>
    adminApi.post('/updateStudentSemesterLevel')

export default adminApi;