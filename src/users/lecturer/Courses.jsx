import { useState, useEffect } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { getCoursesTaking, getCourse } from "../../api/lecturerApi"
import { Link, useNavigate } from "react-router-dom"
import handleApiError from "../../utils/HandleAPIERROR"

export default function CoursesL(){
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseInfo, setCourseInfo] = useState({});
    const [courseLoading, setCourseLoading] = useState(false);
    const userId = localStorage.getItem('userId');
    const [resulAlreadyUploaded, setResultAlreadyUploaded] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCoursesTaking(userId);
                setCourses(res.data.courses || []);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [userId]);

    async function handleCourseClick(courseCode) {
        setSelectedCourse(courseCode);
        setCourseInfo(null);
        setCourseLoading(true);
        try {
            const res = await getCourse(courseCode);
            setCourseInfo(res.data.course);
            setResultAlreadyUploaded(res.data.uploaded);
            setIsClosed(res.data.isClosed);
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        } finally {
            setCourseLoading(false);
        }
    }

    return(
        <div className="mx-auto max-w-md py-2">
            <div className="flex items-center justify-start gap-4 mb-4">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)}/>
                <h3 className="text-xl font-bold">Courses</h3>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-4">
                {courses.length === 0 && !loading && <div>No courses found.</div>}
                {courses.map(course => (
                    <div
                        key={course['Course-Code']}
                        className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${selectedCourse === course['Course-Code'] ? "bg-gray-50" : ""}`}
                        onClick={() => handleCourseClick(course['Course-Code'])}
                    >
                       <div>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{course['Course-Code']}</p>
                                <img src="/images/dropdown.svg" alt="" className="w-8 h-8"/>
                            </div>
                            <p>{course['Course-Title']}</p>
                            <p>{course['Course-Units']}</p>
                            <p>{course['Semester']}</p>
                       </div>
                        {selectedCourse === course['Course-Code'] && (
                            <div className="mt-2">
                                {courseLoading && <Loading />}
                                {courseInfo && (
                                    <div>
                                        <div className="flex items-center gap-2 my-2 ">
                                            <strong>Title:</strong>
                                            <p>{courseInfo['Course-Title']}</p>
                                        </div>
                                        <div className="flex items-center gap-2 my-2 ">
                                            <strong>Code:</strong>
                                            <p>{courseInfo['Course-Code']}</p>
                                        </div>
                                        <div className="flex items-center gap-2 my-2 ">
                                            <strong>Unit:</strong> 
                                            <p>{courseInfo['Course-Units']}</p>
                                        </div>
                                        <div className="flex items-center justify-around">
                                            {isClosed ? 
                                            <div className="p-4 border rounded bg-gray-500 ">
                                                <strong className="text-gray-200">Result Submission for course is closed</strong>
                                            </div> :
                                             !resulAlreadyUploaded ? 
                                            <Link
                                                to={`/lecturer/uploadresult/${courseInfo['Course-Code']}`}
                                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Compute Result
                                            </Link>:
                                            <Link
                                                to={`/lecturer/editResults/${courseInfo['Course-Code']}`}
                                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Edit Result
                                            </Link>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <p className="text-xs text-red-600">Note: courses that are not in the current semester do not have students registered for them</p>
            </div>
        </div>
    )
}