import { useState, useEffect } from "react";
import { allResults } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { Link, useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            try {
                const res = await allResults(userId);
                setResults(res.data.results || []);
            } catch (err) {
               handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [userId]);

    return (
        <div className="max-w-md mx-auto">
            <div className="flex items-center justify-start gap-4 mb-2">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)}/>
                <h2 className="text-2xl font-bold">All Results</h2>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-2">
                {results.length === 0 && !loading && <div>No results yet!</div>}
                {results.map(result => (
                    <Link
                        to={`/student/result/${result._id}`}
                        key={result._id}
                        className="block p-2 border rounded hover:bg-gray-100"
                    >
                        <strong>{result.courseCode}</strong> - {result.courseTitle} | Grade: {result.grade}
                    </Link>
                ))}
            </div>
        </div>
    );
}