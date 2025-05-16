import { useState, useEffect } from "react"
import { 
    alLecturers, 
    allAdmins, 
    allStudents, 
    searchLecturer, 
    searchStudent } from "../../api/adminApi";
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import {Link} from 'react-router-dom'

export default function Profiles(){
    const [current, setCurrent] = useState(0)
    const [search, setSearch] = useState('');
    const [searchResult, setSearchesults] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function HandleSearch(search){
            try{
                setLoading(true);
                if(current === 1){
                    const res = await searchStudent(search);
                    setSearchesults(res.data.results)
                }else{
                    const res = await searchLecturer(search);
                    setSearchesults(res.data.results);
                }
            }catch(error){
                console.log('Error',error.message);
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }
        HandleSearch(search);
    }, [search, current]);

    useEffect(() => {
        async function FetchUsers(){
            try {
                setLoading(true);
                if(current === 1){
                    const res = await allStudents();
                    setResults(res.data.students)
                    localStorage.setItem('current', 1)
                }
                if(current === 2){
                    const res = await alLecturers();
                    setResults(res.data.lecturers);
                    localStorage.setItem('current', 2)
                }
                if(current === 3){
                    const res = await allAdmins();
                    setResults(res.data.admins);
                    localStorage.setItem('current', 3)
                }
            } catch(error){
                console.log('Error',error.message);
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }
        FetchUsers();
    }, [current])

    return(
        <div className="max-w-md mx-auto">
            {error && <Toast text={error} color={'red'}/>}
            {loading && <Loading />}
            {current === 0 && 
            <div className="flex flex-col w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 mt-10">
                <div
                    onClick={() => setCurrent(1) }
                    className="flex flex-col items-center p-4 mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                    <img className="w-12 h-12 mb-2" src="/images/studentSVG.svg" alt="Student" />
                    <h3 className="text-lg font-medium text-gray-700">Student</h3>
                </div>
                <div
                    onClick={() => setCurrent(2)}
                    className="flex flex-col items-center p-4 mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                    <img className="w-12 h-12 mb-2" src="/images/lecturerSVG.svg" alt="Lecturer" />
                    <h3 className="text-lg font-medium text-gray-700">Lecturer</h3>
                </div>
                <div
                    onClick={() => setCurrent(3)}
                    className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                    <img className="w-12 h-12 mb-2" src="/images/adminSVG.svg" alt="Admin" />
                    <h3 className="text-lg font-medium text-gray-700">Admin</h3>
                </div>
            </div>}
            {current === 1 && (
                <div className="flex flex-col w-full p-6">
                    <div className="w-full flex flex-col items-start justify-start">
                        <input type="text" 
                            className="bg-gray-500 rounded-2xl p-4 w-full"
                            value={search}
                            placeholder="Enter name or matric number"
                            onChange={(e) => setSearch(e.target.value)}/>
                        {searchResult && searchResult.length > 0 ? (
                            searchResult.map((result) => (
                                <Link 
                                    to={`/admin/profile/${result._id}`}
                                    key={result._id} 
                                    className="flex items-center justify-start gap-5 w-1/3">
                                    <img src={result.profilePic} alt="image" />
                                    <div className="flex flex-col">
                                        <p>{result.fullName}</p>
                                        <p>{result.matricNo}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="flex items-center justify-between p-4 ">
                                <p>No result found</p>
                            </div>
                        )}
                    </div>
                    <div>
                        {results.map((result) => (
                            <Link 
                                to={`/admin/profile/${result._id}`} 
                                key={result._id}
                                className="flex justify-start items-center gap-5">
                                <img src={result.profilePic} alt="profile pic" />
                                <div className="flex flex-col">
                                    <p>{result.fullName}</p>
                                    <p>{result.adminId}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {current === 2 && (
                <div className="flex flex-col w-full p-6">
                    <div className="w-full flex flex-col items-start justify-start">
                        <input type="text" 
                            className="bg-gray-500 rounded-2xl p-4 w-full"
                            value={search}
                            placeholder="Enter name or registration id"
                            onChange={(e) => setSearch(e.target.value)}/>
                        {searchResult && searchResult.length > 0 ? (
                            searchResult.map((result) => (
                                <Link 
                                    to={`/admin/profile/${result._id}`}
                                    key={result._id} 
                                    className="flex items-center justify-start gap-5 w-1/3">
                                    <img src={result.profilePic} alt="image" />
                                    <div className="flex flex-col">
                                        <p>{result.fullName}</p>
                                        <p>{result.registrationId}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="flex items-center justify-between">
                                <p>No result found</p>
                            </div>
                        )}
                    </div>
                    <div>
                        {results.map((result) => (
                            <Link 
                                to={`/admin/profile/${result._id}`} 
                                key={result._id}
                                className="flex justify-start items-center gap-5">
                                <img src={result.profilePic} alt="profile pic" />
                                <div className="flex flex-col">
                                    <p>{result.fullName}</p>
                                    <p>{result.adminId}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {current === 3 && (
                <div className="flex flex-col w-full p-6 gap-4">
                    {results.map((result) => (
                        <Link 
                            to={`/admin/profile/${result._id}`} 
                            key={result._id}
                            className="flex justify-start items-center gap-5">
                            <img src={result.profilePic} alt="profile pic" />
                            <div className="flex flex-col">
                                <p>{result.fullName}</p>
                                <p>{result.adminId}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}