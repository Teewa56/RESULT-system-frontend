import {useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';

export default function ToggleTheme(){
    const {theme, toggleTheme} = useContext(ThemeContext);
    return (
        <div className={`w-6 h-6 p-2 rounded-3xl 
            ${theme === 'light' ? 'bg-black': 'bg-white'}`}
            onClick={toggleTheme}>
            <img src={theme === 'light' ? '/images/dark' : '/images/light' } 
                alt="image" className='w-4 h-4' />
        </div>
    )
}