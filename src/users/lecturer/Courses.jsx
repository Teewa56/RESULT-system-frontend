import { useState, useEffect } from "react";
import Toast from '../../components/Toast';
import Loading from '../../components/Loaidng';
import { getCoursesTaking, getCourse } from "../../api/lecturerApi";
import { Link, useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function CoursesL() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourseCode, setSelectedCourseCode] = useState("");
    const [courseInfo, setCourseInfo] = useState({});
    const [courseLoading, setCourseLoading] = useState(false);
    const [resultAlreadyUploaded, setResultAlreadyUploaded] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCoursesTaking(userId);
                const uniqueCourses = filterDuplicateCoursesByCode(res.data.courses || []);
                setCourses(uniqueCourses);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [userId]);

    const filterDuplicateCoursesByCode = (coursesList) => {
        const seenCodes = new Set();
        return coursesList.filter(course => {
            const code = course['Course-Code'];
            if (seenCodes.has(code)) return false;
            seenCodes.add(code);
            return true;
        });
    };

    async function handleCourseClick(courseCode) {
        setSelectedCourseCode(courseCode);
        setCourseInfo(null);
        setCourseLoading(true);
        try {
            const res = await getCourse(courseCode);
            setCourseInfo(res.data.course);
            setResultAlreadyUploaded(res.data.uploaded);
            setIsClosed(res.data.isClosed);
        } catch (err) {
            console.error(err);
            setError("Course is not for current semester");
        } finally {
            setCourseLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-md py-2">
            <div className="flex items-center justify-start gap-4 mb-4">
                <img
                    src="/images/back-button.svg"
                    className="md:hidden w-8 h-8"
                    onClick={() => navigate(-1)}
                    alt="Back"
                />
                <h3 className="text-xl font-bold">Courses</h3>
            </div>

            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}

            <div className="space-y-4">
                {courses.length === 0 && !loading && <div>No courses found.</div>}

                {courses.map(course => {
                    const courseCode = course['Course-Code'];
                    return (
                        <div
                            key={courseCode}
                            className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${selectedCourseCode === courseCode ? "bg-gray-50" : ""}`}
                            onClick={() => handleCourseClick(courseCode)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{course['Course-Code']}</p>
                                    <p className="text-sm text-gray-500">{course.Semester}</p>
                                </div>
                                <img src="/images/dropdown.svg" alt="dropdown" className="w-8 h-8" />
                            </div>

                            {selectedCourseCode === courseCode && (
                                <div className="mt-2">
                                    {courseLoading && <Loading />}
                                    {courseInfo && (
                                        <div>
                                            <div className="flex items-center gap-2 my-2">
                                                <strong>Title:</strong>
                                                <p>{courseInfo['Course-Title']}</p>
                                            </div>
                                            <div className="flex items-center gap-2 my-2">
                                                <strong>Code:</strong>
                                                <p>{courseInfo['Course-Code']}</p>
                                            </div>
                                            <div className="flex items-center gap-2 my-2">
                                                <strong>Unit:</strong>
                                                <p>{courseInfo['Course-Units']}</p>
                                            </div>
                                            <div className="flex items-center gap-2 my-2">
                                                <strong>Semester:</strong>
                                                <p>{course.Semester}</p>
                                            </div>

                                            <div className="flex items-center justify-around">
                                                {isClosed ? (
                                                    <div className="p-4 border rounded bg-gray-500">
                                                        <strong className="text-gray-200">
                                                            Result Submission for course is closed
                                                        </strong>
                                                    </div>
                                                ) : !resultAlreadyUploaded ? (
                                                    <Link
                                                        to={`/lecturer/uploadresult/${courseInfo['Course-Code']}`}
                                                        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Compute Result
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/lecturer/editResults/${courseInfo['Course-Code']}`}
                                                        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Edit Result
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
