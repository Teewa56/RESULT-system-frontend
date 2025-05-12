import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './auth/Landing';
import SignIn from './auth/SignIn';
import NotFoundError from './error/NotfoundError';
import { AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import AdminHome from './users/admin/AdminHome';
import LecturerHome from './users/lecturer/LecturerHome';
import StudentHome from './users/student/StudentHome';
import Navbar from './components/Navbar';
import ErrorBoundary from './error/ErrorBoundary';
import './App.css';

const App = () => {
  const { isAuth } = useContext(AuthContext);
  const userType = localStorage.getItem('userType');
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 786);

  useEffect(() => {
    const handleResize = () => setIsWideScreen(window.innerWidth > 786);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function StudentRoutes({ children }) {
    if (userType !== 'student') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }

  function LecturerRoutes({ children }) {
    if (userType !== 'lecturer') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }

  function AdminRoutes({ children }) {
    if (userType !== 'admin') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex items-center justify-between w-full h-screen">
          {isAuth && isWideScreen && <Navbar />}
          <div className={`flex flex-col items-center justify-center ${isAuth && isWideScreen ? 'w-3/4' : 'w-full'} m-4 md:m-0 h-full`}>
            <Routes>
              <Route path="/" element={isAuth ? <Navigate to={`/${userType}`} replace /> : <Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/admin" element={<AdminRoutes><AdminHome /></AdminRoutes>} />
              <Route path="/lecturer" element={<LecturerRoutes><LecturerHome /></LecturerRoutes>} />
              <Route path="/student" element={<StudentRoutes><StudentHome /></StudentRoutes>} />
              <Route path="*" element={<NotFoundError />} />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;