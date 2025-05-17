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
import UpdateSemester from './users/admin/UpdateSemster';
import NewAdmin from './users/admin/NewAdmin';
import NewStudent from './users/admin/NewStudent';
import NewLecturer from './users/admin/NewLecturer';
import Courses from './users/admin/Courses';
import Profiles from './users/admin/Profiles';
import EditAdmin from './users/admin/EditAdmin';
import EditStudent from './users/admin/EditStudent';
import EditLecturer from './users/admin/EditLecturer';
import Profile from './users/admin/Profile';
import Result from './users/admin/Result';
// lecturer routes
import CoursesL from './users/lecturer/Courses';
import EditResult from './users/lecturer/EditResult';
import ResultL from './users/lecturer/Result';
import UploadResult from './users/lecturer/UploadResult';
// student routes
import CarryOverCourses from './users/student/CarryOver';
import RegisteredCourses from './users/student/RegisteredCourses';
import ResultS from './users/student/Result';
import Results from './users/student/Results';
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
          <div className={`p-4 ${isAuth && isWideScreen ? 'w-3/4' : 'w-full'} md:m-0 h-full`}>
            <Routes>
              <Route path="/" element={isAuth ? <Navigate to={`/${userType}`} replace /> : <Landing />} />
              <Route path="/signin" element={<SignIn />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoutes><AdminHome /></AdminRoutes>} />
              <Route path='/admin/updateSemster' element={<AdminRoutes><UpdateSemester /></AdminRoutes>} />
              <Route path='/admin/newAdmin' element={<AdminRoutes><NewAdmin /></AdminRoutes>} />
              <Route path='/admin/newLecturer' element={<AdminRoutes><NewLecturer /></AdminRoutes>} />
              <Route path='/admin/newStudent' element={<AdminRoutes><NewStudent /></AdminRoutes>} />
              <Route path='/admin/courses' element={<AdminRoutes><Courses /></AdminRoutes>} />
              <Route path='/admin/result' element={<AdminRoutes><Result /></AdminRoutes>} />
              <Route path='/admin/profiles' element={<AdminRoutes><Profiles /></AdminRoutes>} />
              <Route path='/admin/profile/:id' element={<AdminRoutes><Profile /></AdminRoutes>} />
              <Route path='/admin/editStudent/:id' element={<AdminRoutes><EditStudent /></AdminRoutes>} />
              <Route path='/admin/editAdmin/:id' element={<AdminRoutes><EditAdmin /></AdminRoutes>} />
              <Route path='/admin/editLecturer/:id' element={<AdminRoutes><EditLecturer /></AdminRoutes>} />

              {/* Lecturer Routes */}
              <Route path="/lecturer" element={<LecturerRoutes><LecturerHome /></LecturerRoutes>} />
              <Route path="/lecturer/courses" element={<LecturerRoutes><CoursesL /></LecturerRoutes>} />
              <Route path="/lecturer/results" element={<LecturerRoutes><ResultL /></LecturerRoutes>} />
              <Route path="/lecturer/uploadresult/:CourseCode" element={<LecturerRoutes><UploadResult /></LecturerRoutes>} />
              <Route path="/lecturer/editResults/:CourseCode" element={<LecturerRoutes><EditResult /></LecturerRoutes>} />

              {/* Student Routes */}
              <Route path="/student" element={<StudentRoutes><StudentHome /></StudentRoutes>} />
              <Route path="/student/registered-courses" element={<StudentRoutes><RegisteredCourses /></StudentRoutes>} />
              <Route path="/student/carry-over" element={<StudentRoutes><CarryOverCourses /></StudentRoutes>} />
              <Route path="/student/results" element={<StudentRoutes><Results /></StudentRoutes>} />
              <Route path="/student/result/:resultId" element={<StudentRoutes><ResultS /></StudentRoutes>} />

              <Route path="*" element={<NotFoundError />} />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;