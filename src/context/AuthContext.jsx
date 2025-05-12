import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {signInAdmin, logoutAdmin} from '../api/adminApi'
import {signInLecturer, logoutLecturer} from '../api/lecturerApi'
import {signInStudent, logoutStudent} from '../api/studentApi'

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    AuthProvider.propTypes = {
        children: PropTypes.node.isRequired
    }
    const userId = localStorage.getItem('userId');
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if(userId){
            setIsAuth(true)
        }else{
            setIsAuth(false);
        }
    },[userId])
    async function LogInstudent(userInfo) {
        try {
            const res = await signInStudent(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.student._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'student')
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        }
    }
    async function LogInlecturer(userInfo) {
        try {
            const res = await signInLecturer(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.lecturer._id)
            setIsAuth(true);
            localStorage.setItem('userType', 'lecturer')
        } catch (error) {
            console.log('Auth Error: ', error.message);
            setError(error.message);
        }
    }
    async function LogInadmin(userInfo) {
        try {
            const res = await signInAdmin(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.admin._id)
            setIsAuth(true);
            localStorage.setItem('userType', 'admin')
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        }
    }
    async function LogOut(){
        const userType = localStorage.getItem('userType');
        try {
            if(userType === 'admin'){
                await logoutAdmin();
                localStorage.removeItem('userId');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                localStorage.removeItem('token');
                setIsAuth(false);
            }else if(userType === 'lecturer'){
                await logoutLecturer();
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                setIsAuth(false);
            }else{
                await logoutStudent();
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                setIsAuth(false);
            }
            window.location.href = '/';
        } catch (error) {
            console.log('Error', error.message);
            setError(error.message);
        }
    }
    return(
        <AuthContext.Provider value={{LogInstudent, LogInlecturer, LogInadmin, LogOut, isAuth, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext,  AuthProvider}