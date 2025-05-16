import { useState, useEffect } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { getCoursesTaking, getCourse } from "../../api/lecturerApi"
import { Link } from "react-router-dom"

export default function CoursesL(){
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseLoading, setCourseLoading] = useState(false);
    const userId = localStorage.getItem('userId');
    //also have some stuffs that will be donelike getting the no of registered students 
    //in the backend the carryover course of a semster will be automatically added to the courses of the next session
    //for that semster
    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCoursesTaking(userId);
                setCourses(res.data.courses || []);
            } catch (err) {
                setError(err.message || "Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [userId]);

    async function handleCourseClick(courseId) {
        setSelectedCourse(courseId);
        setCourseInfo(null);
        setCourseLoading(true);
        try {
            const res = await getCourse(courseId);
            setCourseInfo(res.data.course);
        } catch (err) {
            setError(err.message || "Failed to fetch course info.");
        } finally {
            setCourseLoading(false);
        }
    }

    return(
        <div className="p-5 mx-auto max-w-md">
            <h2 className="text-xl font-bold mb-4">Courses You're Teaching</h2>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-4">
                {courses.length === 0 && !loading && <div>No courses found.</div>}
                {courses.map(course => (
                    <div
                        key={course._id || course.code}
                        className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${selectedCourse === (course._id) ? "bg-gray-50" : ""}`}
                        onClick={() => handleCourseClick(course._id)}
                    >
                        <div className="font-semibold">{course.code} - {course.title}</div>
                        {selectedCourse === (course._id) && (
                            <div className="mt-2">
                                {courseLoading && <Loading />}
                                {courseInfo && (
                                    <div>
                                        <div><strong>Title:</strong> {courseInfo.title}</div>
                                        <div><strong>Code:</strong> {courseInfo.code}</div>
                                        <div><strong>Unit:</strong> {courseInfo.unit}</div>
                                        <div><strong>Semester:</strong> {courseInfo.semester}</div>
                                        <div><strong>Level:</strong> {courseInfo.level}</div>
                                        <Link
                                            to={`/lecturer/uploadResult/${courseInfo._id}`}
                                            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Compute Result
                                        </Link>
                                        <Link
                                            to={`/lecturer/editResults/${courseInfo._id}`}
                                            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Edit Result
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}