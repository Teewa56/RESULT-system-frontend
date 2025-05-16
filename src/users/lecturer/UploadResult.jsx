import { useState, useEffect } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { uploadResult, getCourse, getRegisteredStudents } from "../../api/lecturerApi"
import { useParams, useNavigate } from "react-router-dom"

export default function UploadResult(){
    const { courseId } = useParams();
    const lecturerId = localStorage.getItem('userId');
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const courseRes = await getCourse(courseId);
                setCourse(courseRes.data.course);
                const studentsRes = await getRegisteredStudents(courseId);
                setStudents(studentsRes.data.students || []);
                // Initialize scores state
                const initialScores = {};
                (studentsRes.data.students || []).forEach(stu => {
                    initialScores[stu._id] = { test: '', exam: '' };
                });
                setScores(initialScores);
            } catch (err) {
                setError(err.message || "Failed to load data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [courseId]);

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
        try {
            const results = students.map(stu => ({
                studentId: stu._id,
                test: Number(scores[stu._id]?.test) || 0,
                exam: Number(scores[stu._id]?.exam) || 0
            }));
            await uploadResult(lecturerId, { courseId, results });
            navigate('/admin');
        } catch (err) {
            setError(err.message || "Failed to upload results.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Upload Results</h2>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            {course && (
                <div className="mb-4">
                    <div><strong>Course Title:</strong> {course.title}</div>
                    <div><strong>Course Code:</strong> {course.code}</div>
                    <div><strong>Lecturer:</strong> {course.lecturerName}</div>
                    <div><strong>Course Unit:</strong> {course.unit}</div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">#</th>
                                <th className="border px-2 py-1">Student Name</th>
                                <th className="border px-2 py-1">Matric No</th>
                                <th className="border px-2 py-1">Test Score</th>
                                <th className="border px-2 py-1">Exam Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu, idx) => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    Submit Results
                </button>
            </form>
        </div>
    )
}