import { useState } from "react"
import { updateSemester, registerCourses } from "../../api/adminApi"
import Toast from "../../components/Toast";
import Loading from "../../components/Loaidng";
import { useNavigate } from "react-router-dom";

export default function UpdateSemester(){
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    async function handleOperation() {
        try {
            setLoading(true);
            await updateSemester();
            await registerCourses();
            navigate('/admin')
        } catch (error) {
            console.log(error.message);
            setError(error.message)
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="max-w-md mx-auto flex flex-col py-2" >
            {loading && <Loading />}
            {error && <Toast text={error} color='red' />}
            {showConfirmation && (
                <div className="p-5 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/5 h-fit bg-gray-600 ">
                    <p className="text-center text-red-500 font-semibold">Are You sure you want to update the semester</p>
                    <div className="flex items-center justify-center gap-5">
                        <button className="w-1/2 p-2 bg-gray-900 rounded-2xl"
                        onClick={handleOperation}>Yes</button>
                        <button className="w-1/2 p-2 bg-gray-900 rounded-2xl"
                        onClick={() => setShowConfirmation(false)}>No</button>
                    </div>
                </div>
            )}
            <h3 className="font-bold text-2xl">Update Semester</h3>
            <div className="my-4">
                <p className="font-semibold text-xl">Current Semester</p>
                <div className="p-2 rounded-2xl bg-gray-400  w-1/2"> 
                    First Semster
                </div>
            </div>
            <button onClick={() => setShowConfirmation(true)}
                className="bg-blue-600 w-fit px-5 py-3 mx-auto rounded-3xl">Update Semester</button>
        </div>
    )
}