import {useState} from 'react'
import Data from '../../../cacheInfo.json';
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import { releaseResults, closeSubmission, resultPreview } from '../../api/adminApi';
import {useNavigate} from 'react-router-dom'

const Result = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmType, setConfirmType] = useState(0)
    const [resultData, setResultData] = useState({
        semester: '', level: '', department: ''
    })
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    async function HandleGetResults(){
        if(!resultData) return;
        if(!navigator.onLine) {
            setError('Internet connection error');
            setShowConfirmation(false);
            return;
        }
        try {
            setLoading(true);
            const resultInfo = {data: {...resultData}}
            const res = await resultPreview(resultInfo);
            setResults(res.data.result);
        } catch (error) {
            console.log('error', error.message);
            setError(error.message);
        }finally{
            setLoading(false);
        }
    }
    async function HandleSubmitOperation() {
        if(!navigator.onLine) {
            setError('Internet connection error');
            setShowConfirmation(false);
            return;
        }
        try {
            setLoading(true);
            if(confirmType === 1){
                const res = await closeSubmission();
                console.log(res.data);
            }
            if(confirmType === 2 ){
                const res = await releaseResults();
                console.log(res.data)
            }
            navigate('/admin')
        } catch (error) {
            console.log('error', error.message);
            setError(error.message);
        }finally{
            setLoading(false);
            setShowConfirmation(false);
        }
    }
    const Semesters = Data['Semesters'];
    const Levels = Data['Levels'];
    const Departments = Data['Departments'];
    return (
        <div 
            className={results && results.length >0 
             ? `w-full p-5 flex ${window.innerWidth < 768 ? 'flex-col': "items-center justify-between"}` :'mx-auto max-w-md p-5'}>
            {error && <Toast text={error} color={'red'} /> }
            {loading && <Loading /> }
            {showConfirmation && (
                <div className="p-5 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/5 h-fit bg-gray-600 ">
                    <p className="text-center text-red-500 font-semibold">
                        {`Are you sure you want to 
                            ${confirmType === 1 ? 'close submission for this semester' : 'release last semester\'s results' }`}
                    </p>
                    <div className="flex items-center justify-center gap-5">
                        <button 
                            className="w-1/2 p-2 bg-gray-900 rounded-2xl" 
                            onClick={HandleSubmitOperation}>Yes</button>
                        <button 
                            onClick={() => {
                                setShowConfirmation(false);
                                setConfirmType(0)
                            }}
                            className="w-1/2 p-2 bg-gray-900 rounded-2xl">No</button>
                    </div>
                </div>
            )}
            <div>
                <h3 className='font-bold text-3xl mb-5'>Results</h3>
            </div>
            {confirmType !== 3 &&
            <div className='flex flex-col gap-3'>
                <div 
                    onClick={() => {
                        setShowConfirmation(true);
                        setConfirmType(1)
                    }}
                    className='p-4 border-2 rounded-3xl hover:cursor-pointer border-black'>
                    <p className='font-semibold text-xl '>Close Submission </p>
                </div>
                <div 
                    onClick={() => {
                        setShowConfirmation(true);
                        setConfirmType(2)
                    }}
                    className='p-4 border-2 rounded-3xl hover:cursor-pointer border-black'>
                    <p className='font-semibold text-xl '>Release Results </p>
                </div>
                <div 
                    onClick={() => setConfirmType(3)}
                    className='p-4 border-2 rounded-3xl hover:cursor-pointer border-black flex items-center justify-between'>
                    <p className='font-semibold text-xl '>Preview Results</p>
                    <img 
                        src="/images/back-button.svg" 
                        alt="backbutton" 
                        className='w-10 h-10 rotate-180'/>
                </div>
            </div>}
            {confirmType === 3 && 
                <div className='flex flex-col gap-3'>
                    <div className='py-2'>
                        <label>
                            <p>Semester</p>
                        </label>
                        <select 
                            value={resultData.semester}
                            onChange={(e) => setResultData((prev) => ({...prev, 'semester': e.target.value}))}
                            >
                                {Semesters.map((semst) => (
                                    <option value={semst} key={semst}>{semst}</option>
                                ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        <label>
                            <p>Department</p>
                        </label>
                        <select 
                            value={resultData.department}
                            onChange={(e) => setResultData((prev) => ({...prev, 'department': e.target.value}))}
                            >
                                {Departments.map((dept) => (
                                    <option value={dept} key={dept}>{dept}</option>
                                ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        <label>
                            <p>Level</p>
                        </label>
                        <select 
                            value={resultData.level}
                            onChange={(e) => setResultData((prev) => ({...prev, 'level': e.target.value}))}
                            >
                                {Levels.map((level) => (
                                    <option value={level} key={level}>{level}</option>
                                ))}
                        </select>
                    </div>
                    <button
                    onClick={HandleGetResults}
                        className='px-4 py-2 border-2 rounded-3xl hover:cursor-pointer border-black' >
                        <p>Preview Result</p>
                    </button>
                </div>}
                {/*results && results.length > 0 && (
                    <div>
                        {results.map((result) => (
                            this place will simply show the data
                            and it is a table showing nam, matric no and the scores then finally the gpa and cgpe
                        ))}
                    </div>
                )*/} 
        </div>
    )
}

export default Result