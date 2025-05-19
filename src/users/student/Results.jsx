import { useState, useEffect } from "react";
import { allResults } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { Link } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

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
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [userId]);
    
    return (
        <div className="max-w-md mx-auto">
            <div className="flex items-center justify-start gap-4 mb-2">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-8 h-8 cursor-pointer" 
                    onClick={() => window.history.back()}
                    alt="Back"
                />
                <h2 className="text-2xl font-bold">All Results</h2>
            </div>
            
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            
            <div className="space-y-4">
                {results.length === 0 && !loading && 
                    <div className="p-4 text-center text-gray-500">No results yet!</div>
                }
                
                {results.map(result => (
                    <Link
                        onClick={() => {
                            localStorage.setItem('level', JSON.stringify(result.courses[0].level));
                            localStorage.setItem('semester', JSON.stringify(result.courses[0].semester));
                        }}
                        to={`/student/result/${result.courses[0].student}`}
                        key={result.semester}
                        className="block p-4 border-2 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                        <h3 className="text-xl font-bold">{result.courses[0].level}</h3>
                        <p className="text-lg font-semibold mb-2">{result.semester}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-lg font-medium">Check Result </p>
                            <img 
                                src="/images/back-button.svg" 
                                alt="View results" 
                                className="w-6 h-6 rotate-180"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}