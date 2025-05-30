import axios from 'axios';

const deployURL = 'https://result-system-backend.onrender.com/api';
const localURL = 'http://localhost:5000/api';
const apiURL = deployURL || localURL;

const adminApi = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export const signInAdmin = async(data) => {
    return adminApi.post('/admin/signIn', data);
}
export const adminProfile = async (adminId) => {
    return adminApi.get(`/admin/profile/${adminId}`);
};
export const logoutAdmin = async() => {
    return adminApi.post('/admin/logout')
}
export const editLecturer = async(lecturerInfo, lecturerId) =>{
    return adminApi.put(`/admin/editLecturer/${lecturerId}` ,lecturerInfo)
}
export const editStudent = async(studentInfo, studentId) =>{
    return adminApi.put(`/admin/editStudent/${studentId}`, studentInfo)
}
export const editAdmin = async(adminInfo, adminId) =>{ 
   return  adminApi.put(`/admin/editAdmin/${adminId}`, adminInfo)
}
export const newAdmin = async(adminInfo) =>{
    return adminApi.post(`/admin/newAdmin`, adminInfo)
}
export const newLecturer = async(lecturerInfo) =>{
    return adminApi.post('/admin/newLecturer', lecturerInfo)
}
export const newStudent = async(studentInfo) =>{ 
   return  adminApi.post('/admin/newStudent', studentInfo)
}
export const allAdmins = async() =>{ 
   return  adminApi.get('/admin/allAdmins')
}
export const alLecturers = async() =>{ 
   return  adminApi.get('/admin/allLecturers')
}
export const allStudents = async() =>{
    return adminApi.get('/admin/allStudents')
}
export const searchStudent = async(search) =>{
    return adminApi.get(`/admin/searchStudent/${search}`)
}
export const searchLecturer =  async(search) =>{ 
   return  adminApi.get(`/admin/searchStudent/${search}`)
}
export const studentProfile = async(id) =>{
    return adminApi.get(`/admin/studentProfile/${id}`)
}
export const lecturerProfile = async(id) =>{ 
   return  adminApi.get(`/admin/lecturerProfile/${id}`)
}
export const resultPreview = async (data) => {
  return adminApi.post('/admin/resultPreview', data );
}
export const releaseResults = async() => {
    return adminApi.post('/admin/releaseResult') 
}
export const closeSubmission = async() => {
    return adminApi.post('/admin/closeResultSubmission') 
}
export const getCourseInfo = async (courseInfo) => {
    return adminApi.get('/admin/getCourseInfo', { 
        params: courseInfo 
    });
}
export const getCurrentSemester = async() => { 
    return adminApi.get('/admin/currentSemester');
}
export const registerCourses = async() => {
    return adminApi.post('/admin/registerCourses') 
}
export const updateSemester = async() => {
    return adminApi.post('/admin/updateStudentSemesterLevel')
}

export default adminApi;