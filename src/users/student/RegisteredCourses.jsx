import { useState, useEffect } from "react";
import { registeredCourses } from "../../api/studentApi";
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';

export default function RegisteredCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const res = await registeredCourses(userId);
                setCourses(res.data.courses || []);
            } catch (err) {
                setError(err.message || "Failed to fetch registered courses.");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [userId]);

    return (
        <div className="mx-auto max-w-md">
            <h2 className="text-xl font-bold mb-4">Registered Courses</h2>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="space-y-2">
                {courses.length === 0 && !loading && <div>No registered courses.</div>}
                {courses.map(course => (
                    <div key={course._id || course.code} className="p-2 border rounded">
                        <strong>{course.code}</strong>: {course.title}
                    </div>
                ))}
            </div>
        </div>
    );
}