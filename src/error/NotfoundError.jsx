import {useNavigate} from 'react-router-dom'

export default function NotFoundError(){
    const navigate = useNavigate();
    return(
        <div className="h-screen flex items-center justify-center ">
            <div className="max-w-md p-4 flex flex-col items-center justify-center">
                <img src="/images/notFound.svg" alt="404 error"
                    className='w-32 h-32 mb-4' />
                <p className='mt-2'>Page Not Found, go Back</p>
                <img src="/images/back-button.svg" alt="back button"
                    className='w-6 h-6 my-4' 
                    onClick={() => navigate('/')}/>
            </div>
        </div>
    )
}