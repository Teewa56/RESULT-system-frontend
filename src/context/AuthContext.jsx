import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { signInAdmin, logoutAdmin } from '../api/adminApi';
import { signInLecturer, logoutLecturer } from '../api/lecturerApi';
import { signInStudent, logoutStudent } from '../api/studentApi';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const userId = localStorage.getItem('userId');
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, [userId]);

    async function LogInstudent(userInfo) {
        setError(null);
        try {
            const res = await signInStudent(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.student._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'student');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                }else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
        }
    }

    async function LogInlecturer(userInfo) {
        setError(null);
        try {
            const res = await signInLecturer(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.lecturer._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'lecturer');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                }else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
            setIsAuth(false);
        }
    }

    async function LogInadmin(userInfo) {
        setError(null);
        try {
            const res = await signInAdmin(userInfo);
            const data = res;
            localStorage.setItem('token', data.data.access_token);
            localStorage.setItem('userId', data.data.admin._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'admin');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 402) {
                    setError("Wrong Password.");
                }else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
            setIsAuth(false);
        }
    }

    async function LogOut() {
        setError(null);
        const userType = localStorage.getItem('userType');
        try {
            if (userType === 'admin') {
                await logoutAdmin();
                localStorage.removeItem('userId');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                localStorage.removeItem('token');
                setIsAuth(false);
            } else if (userType === 'lecturer') {
                await logoutLecturer();
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                setIsAuth(false);
            } else {
                await logoutStudent();
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                localStorage.removeItem('theme');
                setIsAuth(false);
            }
            window.location.href = '/';
        } catch (err) {
            console.error("Full error object:", err);

            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);

                if (status === 404) {
                    setError("No results found for this user.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
            setIsAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{ LogInstudent, LogInlecturer, LogInadmin, LogOut, isAuth, error }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { AuthContext, AuthProvider };