import { useState, useEffect } from "react";
import { allResults } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { Link } from "react-router-dom";

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            try {
                const res = await allResults(userId);
                setResults(res.data.results || []);
            } catch (err) {
                setError(err.message || "Failed to fetch results.");
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [userId]);

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">All Results</h2>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-2">
                {results.length === 0 && !loading && <div>No results found.</div>}
                {results.map(result => (
                    <Link
                        to={`/student/result/${result._id || result.courseId}`}
                        key={result._id || result.courseId}
                        className="block p-2 border rounded hover:bg-gray-100"
                    >
                        <strong>{result.courseCode}</strong> - {result.courseTitle} | Grade: {result.grade}
                    </Link>
                ))}
            </div>
        </div>
    );
}