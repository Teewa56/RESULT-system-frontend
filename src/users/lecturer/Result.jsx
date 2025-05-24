import { useState, useEffect, useRef } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
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
                const seen = new Set();
                const uniqueCourses = res.data.courses.filter(course => {
                    if (seen.has(course['Course-Code'])) return false;
                    seen.add(course['Course-Code']);
                    return true;
                });
                setCourses(uniqueCourses || []);
            } catch (err) {
                console.log(err.message);
                setError("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [lecturerId]);

    async function handleCourseClick(courseCode) {
        setSelectedCourse(courseCode);
        console.log("Selected course:", courseCode);
        setResultLoading(true);
        setResults([]);
        setError(null);
        try {
            const res = await getCourseResult(courseCode, lecturerId);
            setResults(res.data.results || []);
        } catch (err) {
            if (err.response) {
                const status = err.response.status;

                if (status === 404) {
                    setError("No results found.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
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
        } finally {
            setResultLoading(false);
        }
    }

    function handlePrint() {
        window.print();
    }

    return(
        <div className="max-w-md mx-auto">
            <div className="flex items-center justify-start gap-4 mb-4 print:hidden">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => window.history.back()}/>
                <h3 className="text-2xl font-bold">Course Results Preview</h3>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-4 mb-6 print:hidden">
                {courses.length === 0 && !loading && <div>No courses found.</div>}
                {courses.map(course => (
                    <div
                        key={course['Course-Code']}
                        className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${selectedCourse === course['Course-Code'] ? "bg-gray-50" : ""}`}
                        onClick={() => handleCourseClick(course['Course-Code'])}
                    >
                        <div className="font-semibold">{course['Course-Code']}</div>
                    </div>
                ))}
            </div>
            {selectedCourse && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 print:hidden">
                        Results for {selectedCourse}
                    </h3>
                    {resultLoading && <Loading />}
                    {results.length === 0 && !resultLoading && <div>No results found for this course.</div>}
                    {results.length > 0 && (
                        <div className="overflow-x-auto">
                            <div className="print-content">
                                <h2 className="text-center font-bold mb-4 hidden print:block">Results for {selectedCourse}</h2>
                                <div ref={printRef}>
                                    <table className="min-w-full border">
                                        <thead>
                                            <tr>
                                                <th className="border px-2 py-1">S/N</th>
                                                <th className="border px-2 py-1">Student Name</th>
                                                <th className="border px-2 py-1">Matric No</th>
                                                <th className="border px-2 py-1">Score</th>
                                                <th className="border px-2 py-1">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((res, idx) => (
                                                <tr key={res._id}>
                                                    <td className="border px-2 py-1">{idx + 1}</td>
                                                    <td className="border px-2 py-1">{res.student.fullName || "-"}</td>
                                                    <td className="border px-2 py-1">{res.student.matricNo || "-"}</td>
                                                    <td className="border px-2 py-1">{res.testScore + res.examScore}</td>
                                                    <td className="border px-2 py-1">{res.grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p style={{fontSize: '15px'}} className="text-red-300 print:hidden">Note: Grade remains unchanged until results are released</p>
                                </div>
                            </div>
                            <Link
                                to={`/lecturer/editResults/${selectedCourse}`}
                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
                            >
                                Edit Result
                            </Link>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 print:hidden"
                            >
                                Print result
                            </button>
                        </div>
                    )}
                </div>
            )}
            <style>{`
                @media print {
                    @page {
                        size: portrait;
                        margin: 1cm;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    .print-content,
                    .print-content * {
                        visibility: visible;
                    }
                    
                    .print-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 15px;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                }
            `}</style>
        </div>
    )
}