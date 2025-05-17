import { useState, useEffect } from "react";
import { getResult, getGpa } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { useParams, useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function ResultS() {
    const { resultId } = useParams();
    const userId = localStorage.getItem('userId');
    const [result, setResult] = useState({});
    const [gpa, setGpa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResult() {
            setLoading(true);
            try {
                const res = await getResult(userId, { resultId });
                setResult(res.data.result);
                const gpaRes = await getGpa(userId, { resultId });
                setGpa(gpaRes.data.gpa);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        fetchResult();
    }, [userId, resultId]);

    return (
        <div className="mx-auto max-w-md">
            <div className="flex items-center justify-start gap-4 mb-2">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)}/>
                <h2 className="text-xl font-bold mb-4">Result Details</h2>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            {result && (
                <div className="p-4 border rounded">
                    <div><strong>Course:</strong> {result.courseTitle} ({result.courseCode})</div>
                    <div><strong>Score:</strong> {result.score}</div>
                    <div><strong>Grade:</strong> {result.grade}</div>
                    <div><strong>Session:</strong> {result.session}</div>
                    <div><strong>Semester:</strong> {result.semester}</div>
                </div>
            )}
            {gpa !== null && (
                <div className="mt-4 p-2 border rounded">
                    <strong>GPA:</strong> {gpa}
                </div>
            )}
        </div>
    );
}