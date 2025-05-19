import { useState, useEffect, useRef } from "react";
import { getResult, getGpa, studentProfile } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { useParams, useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function ResultS() {
    const { studentId } = useParams();
    const [result, setResult] = useState([]);
    const [gpa, setGpa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cGPA, setCGPA] = useState(null);
    const [student, setStudent] = useState({});
    const navigate = useNavigate();
    const level = JSON.parse(localStorage.getItem('level'));
    const semester = JSON.parse(localStorage.getItem('semester'));
    const printRef = useRef();

    useEffect(() => {
        return () => {
            localStorage.removeItem('level');
            localStorage.removeItem('semester');
        };
    }, []);

    useEffect(() => {
        async function fetchResult() {
            setLoading(true);
            try {
                const res = await getResult(studentId, { data: { level, semester } });
                setResult(res.data.results);
                const gpaRes = await getGpa(studentId);
                const studentRes = await studentProfile(studentId);
                setStudent(studentRes.data.student);
                setGpa(gpaRes.data.gpa);
                setCGPA(gpaRes.data.cgpa);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchResult();
    }, [studentId, level, semester]);

    return (
        <div className="mx-auto max-w-md px-2">
            <div className="flex items-center justify-start gap-4 mb-2 print:hidden">
                <img
                    src="/images/back-button.svg"
                    className="md:hidden w-8 h-8 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-xl font-bold mb-4">Result Details</h2>
            </div>

            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}

            {result.length > 0 && (
                <div className="overflow-x-auto print-area" ref={printRef}>
                    <h2 className="text-xl font-bold mb-2">{`${level} ${semester} Result`}</h2>
                    <div className="mb-4 space-y-2">
                        <div><span className="font-bold">Full Name:</span> {student.fullName}</div>
                        <div><span className="font-bold">Matric Number:</span> {student.matricNo}</div>
                        <div><span className="font-bold">Semester:</span> {student.currentSemester}</div>
                        <div><span className="font-bold">Level:</span> {student.currentLevel}</div>
                        <div><span className="font-bold">Department:</span> {student.department}</div>
                    </div>

                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Course Code</th>
                                <th className="border border-gray-300 p-2 text-left">Test Score</th>
                                <th className="border border-gray-300 p-2 text-left">Exam Score</th>
                                <th className="border border-gray-300 p-2 text-left">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((item) => (
                                <tr key={item.courseCode}>
                                    <td className="border border-gray-300 p-2">{item.courseCode}</td>
                                    <td className="border border-gray-300 p-2">{item.testScore}</td>
                                    <td className="border border-gray-300 p-2">{item.examScore}</td>
                                    <td className="border border-gray-300 p-2">{item.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {gpa !== null && (
                <div className="mt-4 p-4 border rounded-xl flex items-center justify-between text-sm">
                    <strong>GPA: {gpa}</strong>
                    <strong>CGPA: {cGPA}</strong>
                </div>
            )}

            <div className="mt-4 print:hidden">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                    onClick={() => window.print()}
                >
                    Print Result
                </button>
            </div>
        </div>
    );
}
