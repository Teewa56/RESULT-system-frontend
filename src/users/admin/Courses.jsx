import { useState, useEffect } from "react";
import Data from '../../../cacheInfo.json';
import { getCourseInfo } from "../../api/adminApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import {useNavigate} from 'react-router-dom'
import handleApiError from "../../utils/HandleAPIERROR";

export default function Courses() {
    const [courseInfo, setCourseInfo] = useState({
        department: '',
        semester: '',
        level: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const Departments = Data['Departments'];
    const Levels = Data['Levels'];
    const Semesters = Data['Semesters'];

    useEffect(() => {
        if (Departments.length > 0) {
            setCourseInfo(prev => ({ ...prev, department: Departments[0] }));
        }
        if (Levels.length > 0) {
            setCourseInfo(prev => ({ ...prev, level: Levels[0] }));
        }
        if (Semesters.length > 0) {
            setCourseInfo(prev => ({ ...prev, semester: Semesters[0] }));
        }
    }, [Departments, Levels, Semesters]);

    function updateCourseInfo(field, value) {
        setCourseInfo((prev) => ({
            ...prev, [field]: value
        }));
        if (showResults) {
            setShowResults(false);
        }
    }

    async function handleGetCourses() {
        if (!courseInfo.department || !courseInfo.level || !courseInfo.semester) {
            setError("Please select all required fields");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await getCourseInfo(courseInfo);
            setCourseData(res.data.courses);
            console.log('courses',res.data.courses)
            setShowResults(true);
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
            setCourseData([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" w-full">
            {loading && <Loading />}
            {error && <Toast text={error} color={'red'} />}
            
            <div className={`w-full`}>
                <div className="flex items-center justify-start gap-4">
                    <img src="/images/back-button.svg" className="md:hidden w-6 h-6" 
                        onClick={() => navigate(-1)}/>
                    <h3 className="text-3xl font-bold">Courses</h3>
                </div>
                
                <div className="flex flex-col space-y-4 my-5">
                    <div className="w-full">
                        <label className="block font-semibold text-xl mb-2">Department</label>
                        <select 
                            className="bg-gray-300 p-3 rounded-xl w-full "
                            value={courseInfo.department}
                            onChange={(e) => updateCourseInfo('department', e.target.value)}>
                            {Departments.map((department) => (
                                <option value={department} key={department}>{department}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-full">
                        <label className="block font-semibold text-xl mb-2">Level</label>
                        <select 
                            className="bg-gray-300 p-3 rounded-xl w-full "
                            value={courseInfo.level}
                            onChange={(e) => updateCourseInfo('level', e.target.value)}>
                            {Levels.map((level) => (
                                <option value={level} key={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-full">
                        <label className="block font-semibold text-xl mb-2">Semester</label>
                        <select
                            className="bg-gray-300 p-3 rounded-xl w-full "
                            value={courseInfo.semester}
                            onChange={(e) => updateCourseInfo('semester', e.target.value)}>
                            {Semesters.map((semester) => (
                                <option value={semester} key={semester}>{semester}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-white font-medium transition-colors duration-200 w-full md:w-auto"
                        onClick={handleGetCourses}>
                        Find Courses
                    </button>
                </div>
            </div>
            
            {showResults && (
                <div className="mt-8 border-t pt-6">
                    <h4 className="text-2xl font-semibold mb-4">
                        {courseData.length > 0 
                            ? `Available Courses (${courseData.length})`
                            : "No courses found for the selected criteria"}
                    </h4>
                    
                    {courseData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courseData.map((course, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
                                    <h5 className="font-bold text-lg">{course["Course-Code"]}</h5>
                                    <p className="text-gray-700 dark:text-gray-300">{course["Course-Title"]}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{course["Course-Units"]} Units</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}