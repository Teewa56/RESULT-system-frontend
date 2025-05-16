import { useState } from "react"
import Data from '../../../cacheInfo.json'
import { getCourseInfo } from "../../api/adminApi";
import Loading from '../../components/Loaidng'
import Toast from '../../components/Toast'

export default function Courses(){
    const [courseInfo, setCourseInfo] = useState({
        department: '', semester: '', level: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState([]);
    function updateCourseInfo(field, value){
        setCourseInfo((prev) => ({
            ...prev, [field]: value
        }));
    }
    async function handleGetCourses() {
        try {
            setLoading(true);
            const res = await getCourseInfo(courseInfo)
            setCourseData(res.data.courses)
        } catch (error) {
            console.log(error.message);
            setError(error.message)
        }finally{
            setLoading(false);
        }
    }
    const Departments = Data['Departments'];
    const Levels = Data['Levels'];
    const Semesters = Data['Semesters']
    return(
        <div className="p-4 w-full">
            {loading && <Loading />}
            {error && <Toast text={error} color={'red'} /> }
            <div className={`${courseData && 'w-1/2'}`}>
                <h3 className={`text-3xl font-bold `}>Courses</h3>
                <div className="flex flex-col items-start justify-start my-5">
                    <div className="py-2">
                        <label>
                            <p className="font-semibold text-xl">Department</p>
                        </label>
                        <select 
                            className="bg-gray-200 p-2 rounded-xl "
                            value={courseInfo.department}
                            onChange={(e) => updateCourseInfo('department', e.target.value)}>
                            {Departments.map((department) => (
                                <option value={department} key={department}>{department}</option>
                            ))}
                        </select>
                    </div>
                    <div className="py-2">
                        <label>
                            <p className="font-semibold text-xl">Level</p>
                        </label>
                        <select 
                            className="bg-gray-200 p-2 rounded-xl "
                            value={courseInfo.level}
                            onChange={(e) => updateCourseInfo('level', e.target.value)}>
                            {Levels.map((level) => (
                                <option value={level} key={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <div className="p-2">
                        <label>
                            <p className="font-semibold text-xl">Semester</p>
                        </label>
                        <select
                            className="bg-gray-200 p-2 rounded-xl " 
                            value={courseInfo.semester}
                            onChange={(e) => updateCourseInfo('semester', e.target.value)}>
                            {Semesters.map((semester) => (
                                <option value={semester} key={semester}>{semester}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        className="bg-black px-4 py-2 rounded-2xl text-white  mt-2"
                        onClick={handleGetCourses}>
                        <p>Check out course</p>
                    </button>
                </div>
            </div>
            {courseData && (
                <div>
                    {/*this is where the courses will be displayed*/}
                </div>
            )}
        </div>
    )
}