import { useEffect, useState } from "react"
import { updateSemester, registerCourses, getCurrentSemester } from "../../api/adminApi"
import Toast from "../../components/Toast";
import Loading from "../../components/Loaidng";
import { useNavigate } from "react-router-dom";
import handleApiError from "../../utils/HandleAPIERROR";

export default function UpdateSemester(){
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const [currentSemester, setCurrentSemester] = useState('First Semester')
    const navigate = useNavigate();
    async function handleOperation() {
        try {
            setLoading(true);
            setError(null);
            const updateResponse = await updateSemester();
            if (updateResponse.data.message !== 'Student semester and level updated') {
                setError('Failed to update semester');
            }
            const registerResponse = await registerCourses();
            if (registerResponse.data.message !== 'Courses registered for all students') {
                setError('Failed to register courses');
            }
            
            navigate('/admin');
        }catch (err) {
            handleApiError(err, setError, "An unexpected error occuured")
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        async function GetCurentSemester(){
            setError(null);
            try {
                const res = await getCurrentSemester();
                setCurrentSemester(res.data.currentSemester);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occuured")
            }
        }
        GetCurentSemester();
    }, [])
    return(
        <div className="max-w-md mx-auto flex flex-col py-2" >
            {loading && <Loading />}
            {error && <Toast text={error} color='red' />}
            {showConfirmation && (
                <div className="p-5 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/5 w-2/3  h-fit bg-gray-600 ">
                    <p className="text-center text-red-500 font-semibold">Are You sure you want to update the semester</p>
                    <div className="flex items-center justify-center gap-5">
                        <button className="w-1/2 p-2 bg-gray-900 rounded-2xl"
                        disabled={loading}
                        onClick={handleOperation}>{loading ? "Loading..." : "Yes" }</button>
                        <button className="w-1/2 p-2 bg-gray-900 rounded-2xl"
                        disabled={loading}
                        onClick={() => setShowConfirmation(false)}>{loading ? "Loading..." : "No" }</button>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-start gap-4">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-10 h-10" 
                    onClick={() => navigate(-1)} 
                />
                <h3 className="text-3xl font-bold">Update Semester</h3>
            </div>
            <div className="my-4">
                <p className="font-semibold text-xl">Current Semester</p>
                <div className="p-2 rounded-2xl bg-gray-400  w-1/2"> 
                   {currentSemester}
                </div>
            </div>
            <button onClick={() => setShowConfirmation(true)}
                className="bg-blue-600 w-fit px-5 py-3 mx-auto rounded-3xl">Update Semester</button>
        </div>
    )
}