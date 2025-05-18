import { useState } from 'react';
import Data from '../../../cacheInfo.json';
import Toast from '../../components/Toast';
import Loading from '../../components/Loaidng';
import { releaseResults, closeSubmission, resultPreview } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import handleApiError from '../../utils/HandleAPIERROR';

const Result = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmType, setConfirmType] = useState(0);
  const [resultData, setResultData] = useState({ semester: '', level: '', department: '' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function HandleGetResults() {
    if (!navigator.onLine) {
        setError('Internet connection error');
        return;
    }

    try {
        setLoading(true);
        setError(null);
        const res = await resultPreview({ 
            data: { 
              level: resultData.level,
              department: resultData.department,
              semester: resultData.semester
            }
        });
        const fetchedResults = res.data.results;
        setResults(fetchedResults);
        if (fetchedResults.length === 0) {
          setError("No results found.");
        }
      } catch (err) {
        handleApiError(err, setError, "An unexpected error occuured")
        setResults([]);
      } finally {
        setLoading(false);
      }
  }

    async function HandleSubmitOperation() {
      if (!navigator.onLine) {
        setError('Internet connection error');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        let response;
        if (confirmType === 1) {
          response = await closeSubmission();
          if (response.data.message !== 'All courses result submission closed') {
            setError('Failed to update semster')
          }
        }
        if (confirmType === 2) {
            response = await releaseResults();
            if (response.data.message !== 'Results released successfully') {
              setError('Failed to release results');
            }
        }
        navigate('/admin');
        } catch (err) {
          handleApiError(err, setError, "An unexpected error occuured")
        } finally {
          setLoading(false);
          setShowConfirmation(false);
        }
    }

    const Semesters = Data['Semesters'];
    const Levels = Data['Levels'];
    const Departments = Data['Departments'];

  return (
    <div className='flex flex-col'>
      {error && <Toast text={error} color="red" />}
      {loading && <Loading />}
      {showConfirmation && (
        <div className="p-5 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-fit bg-gray-600">
          <p className="text-center text-red-500 font-semibold">
            {`Are you sure you want to ${confirmType === 1 ? 'close submission for this semester' : 'release last semester\'s results'}`}
          </p>
          <div className="flex items-center justify-center gap-5">
            <button className="w-1/2 p-2 bg-gray-900 rounded-2xl" onClick={HandleSubmitOperation}>Yes</button>
            <button className="w-1/2 p-2 bg-gray-900 rounded-2xl" onClick={() => { setShowConfirmation(false); setConfirmType(0); }}>No</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-start gap-4 mb-4">
        <img src="/images/back-button.svg" className="md:hidden w-10 h-10" onClick={() => navigate(-1)} />
        <h3 className="text-3xl font-bold">Results</h3>
      </div>

      {confirmType !== 3 && (
        <div className="flex flex-col gap-3">
          <div onClick={() => { setShowConfirmation(true); setConfirmType(1); }} className="p-4 border-2 rounded-3xl hover:cursor-pointer border-black">
            <p className="font-semibold text-xl">Close Submission</p>
          </div>
          <div onClick={() => { setShowConfirmation(true); setConfirmType(2); }} className="p-4 border-2 rounded-3xl hover:cursor-pointer border-black">
            <p className="font-semibold text-xl">Release Results</p>
          </div>
          <div onClick={() => setConfirmType(3)} className="p-4 border-2 rounded-3xl hover:cursor-pointer border-black flex items-center justify-between">
            <p className="font-semibold text-xl">Preview Results</p>
            <img src="/images/back-button.svg" alt="backbutton" className="w-10 h-10 rotate-180" />
          </div>
        </div>
      )}

      {confirmType === 3 && (
        <div className="flex flex-col gap-3">
          <div className="py-2">
            <label><p>Semester</p></label>
            <select className='border-2  rounded-2xl bg-gray-200 p-2' value={resultData.semester} onChange={(e) => setResultData(prev => ({ ...prev, semester: e.target.value }))}>
              <option value=""></option>
              {Semesters.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="py-2">
            <label><p>Department</p></label>
            <select className='border-2  rounded-2xl bg-gray-200 p-2' value={resultData.department} onChange={(e) => setResultData(prev => ({ ...prev, department: e.target.value }))}>
              <option value=""></option>
              {Departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="py-2">
            <label><p>Level</p></label>
            <select className='border-2  rounded-2xl bg-gray-200 p-2' value={resultData.level} onChange={(e) => setResultData(prev => ({ ...prev, level: e.target.value }))}>
              <option value=""></option>
              {Levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={HandleGetResults} className="px-4 py-2 border-2 w-fit rounded-3xl hover:cursor-pointer border-black">
            <p>Preview Result</p>
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Full Name</th>
                <th className="border border-gray-400 px-4 py-2">Matric No</th>
                <th className="border border-gray-400 px-4 py-2">GPA</th>
                <th className="border border-gray-400 px-4 py-2">CGPA</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => {
                const scores = res.results || [];
                const gpa = scores.reduce((acc, r) => acc + (r.gpa || 0), 0).toFixed(2);
                const cgpa = scores.reduce((acc, r) => acc + (r.cgpa || 0), 0).toFixed(2);
                return (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{res.fullName}</td>
                    <td className="border px-4 py-2">{res.matricNo}</td>
                    <td className="border px-4 py-2">{gpa}</td>
                    <td className="border px-4 py-2">{cgpa}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    )}
    {confirmType === 3 && results.length === 0 && !loading && error && (
        <div className='mt-4'>
            <img src="/images/error.svg" className='w-20 h-20 mx-auto' alt="" />
            <p className='text-2xl text-center'>No result for course</p>
        </div>
    )}
    </div>
  );
};

export default Result;
