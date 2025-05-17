import { useState, useEffect } from "react";
import { registeredCourses } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import handleApiError from "../../utils/HandleAPIERROR";
import {useNavigate} from 'react-router-dom';

export default function RegisteredCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const res = await registeredCourses(userId);
                setCourses(res.data.courses || []);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [userId]);

    return (
        <div className="mx-auto max-w-md">
            <div className="flex items-center justify-start gap-4 mb-2">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)}/>
                <h2 className="text-2xl font-bold">Registered Courses</h2>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-2">
                {courses.length === 0 && !loading && <div>No registered courses.</div>}
                {courses.map(course => (
                    <div key={course['Course-Code']} className="p-2 border rounded">
                        <strong>{course['Course-Code']}</strong>
                        <p>{course['Course-Title']}</p>
                        <p>{course['Course-Units']} Units</p>
                    </div>
                ))}
            </div>
        </div>
    );
}