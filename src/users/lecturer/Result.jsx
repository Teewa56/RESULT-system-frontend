import { useState, useEffect, useRef } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import { getCourseResult, getCoursesTaking } from "../../api/lecturerApi"
import { Link } from "react-router-dom"

export default function ResultL(){
    const lecturerId = localStorage.getItem('userId');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [results, setResults] = useState([]);
    const [resultLoading, setResultLoading] = useState(false);
    const printRef = useRef();

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCoursesTaking(lecturerId);
                setCourses(res.data.courses || []);
            } catch (err) {
                setError(err.message || "Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [lecturerId]);

    async function handleCourseClick(courseId) {
        setSelectedCourse(courseId);
        setResultLoading(true);
        setResults([]);
        setError(null);
        try {
            const res = await getCourseResult(courseId, lecturerId);
            setResults(res.data.results || []);
        } catch (err) {
            setError(err.message || "Failed to fetch course results.");
        } finally {
            setResultLoading(false);
        }
    }

    function handlePrint() {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    }

    return(
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Preview Course Results</h2>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-4 mb-6">
                {courses.length === 0 && !loading && <div>No courses found.</div>}
                {courses.map(course => (
                    <div
                        key={course._id || course.code}
                        className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${selectedCourse === (course._id || course.code) ? "bg-gray-50" : ""}`}
                        onClick={() => handleCourseClick(course._id || course.code)}
                    >
                        <div className="font-semibold">{course.code} - {course.title}</div>
                    </div>
                ))}
            </div>
            {selectedCourse && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Results for {courses.find(c => (c._id || c.code) === selectedCourse)?.title || ""}
                    </h3>
                    {resultLoading && <Loading />}
                    {results.length === 0 && !resultLoading && <div>No results found for this course.</div>}
                    {results.length > 0 && (
                        <div className="overflow-x-auto" ref={printRef}>
                            <table className="min-w-full border">
                                <thead>
                                    <tr>
                                        <th className="border px-2 py-1">#</th>
                                        <th className="border px-2 py-1">Student Name</th>
                                        <th className="border px-2 py-1">Matric No</th>
                                        <th className="border px-2 py-1">Score</th>
                                        <th className="border px-2 py-1">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((res, idx) => (
                                        <tr key={res.studentId}>
                                            <td className="border px-2 py-1">{idx + 1}</td>
                                            <td className="border px-2 py-1">{res.fullName || "-"}</td>
                                            <td className="border px-2 py-1">{res.matricNo || "-"}</td>
                                            <td className="border px-2 py-1">{res.score}</td>
                                            <td className="border px-2 py-1">{res.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Link
                                to={`/lecturer/editResults/${selectedCourse}`}
                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print-hide"
                            >
                                Edit Result
                            </Link>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 print-hide"
                            >
                                Print result
                            </button>
                        </div>
                    )}
                </div>
            )}
            <style>{`
                @media print {
                    .print-hide {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}