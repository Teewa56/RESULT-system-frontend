import { useState, useEffect } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng' 
import { editResult, getCourse, getRegisteredStudents, getCourseResult } from "../../api/lecturerApi"
import { useParams, useNavigate } from "react-router-dom"
import handleApiError from "../../utils/HandleAPIERROR"

export default function EditResult(){
    const { CourseCode: courseId } = useParams(); 
    const lecturerId = localStorage.getItem('userId');
    const [course, setCourse] = useState({});
    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const courseRes = await getCourse(courseId);
                setCourse(courseRes.data.course);
                const studentsRes = await getRegisteredStudents(courseId);
                setStudents(studentsRes.data.students || []);
                const resultsRes = await getCourseResult(courseId, lecturerId);
                const initialScores = {};
                studentsRes.data.students.forEach(stu => {
                    const result = resultsRes.data.results.find(r => r.student._id === stu._id);
                    initialScores[stu._id] = {
                        test: result ? result.testScore : '',
                        exam: result ? result.examScore : ''
                    };
                });
                setScores(initialScores);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred")
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [courseId, lecturerId]);

    function handleScoreChange(studentId, field, value) {
        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            for (const student of students) {
                const studentId = student._id;
                const testScore = Number(scores[studentId]?.test) || 0;
                const examScore = Number(scores[studentId]?.exam) || 0;
                await editResult(lecturerId, {data:{
                    courseCode: courseId,
                    studentId: studentId,
                    testScore: testScore,
                    examScore: examScore
                }});
            }
            
            setSuccess("All results saved successfully");
            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occurred")
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <div className="flex items-center justify-start gap-4 mb-4">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)} alt="Back"/>
                <h3 className="text-2xl font-bold">Edit {course['Course-Code']} Results</h3>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            {success && <Toast text={success} color="green" />}
            {course && (
                <div className="mb-4">
                    <div><strong>Course Title:</strong> {course["Course-Title"]}</div>
                    <div><strong>Course Code:</strong> {course["Course-Code"]}</div>
                    <div><strong>Course Unit:</strong> {course["Course-Units"]}</div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">S/N</th>
                                <th className="border px-2 py-1">Student Name</th>
                                <th className="border px-2 py-1">Matric No</th>
                                <th className="border px-2 py-1">Test Score</th>
                                <th className="border px-2 py-1">Exam Score</th>
                                <th className="border px-2 py-1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu, idx) => {
                                const testScore = Number(scores[stu._id]?.test) || 0;
                                const examScore = Number(scores[stu._id]?.exam) || 0;
                                const totalScore = testScore + examScore;
                                
                                return (
                                    <tr key={stu._id}>
                                        <td className="border px-2 py-1">{idx + 1}</td>
                                        <td className="border px-2 py-1">{stu.fullName}</td>
                                        <td className="border px-2 py-1">{stu.matricNo}</td>
                                        <td className="border px-2 py-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max="40"
                                                value={scores[stu._id]?.test || ''}
                                                onChange={e => handleScoreChange(stu._id, 'test', e.target.value)}
                                                className="w-16 p-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="border px-2 py-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max="60"
                                                value={scores[stu._id]?.exam || ''}
                                                onChange={e => handleScoreChange(stu._id, 'exam', e.target.value)}
                                                className="w-16 p-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {totalScore}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {students.length === 0 && (
                    <div className="my-5">
                        <img src="/images/error.svg" alt="Error" className="w-10 h-10 mx-auto m-2"/>
                        <p className="text-center">No Students and Information Found for this course</p>
                    </div>
                )}
                <button
                    type="submit"
                    className={`mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${students.length === 0 && 'cursor-not-allowed opacity-50'}`}
                    disabled={loading || students.length === 0}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}