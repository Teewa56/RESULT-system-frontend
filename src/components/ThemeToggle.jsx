import {useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';

export default function ToggleTheme(){
    const {theme, toggleTheme} = useContext(ThemeContext);
    return (
        <div className={`p-2 rounded-xl flex items-center justify-center
            ${theme === 'light' ? 'bg-white border-2 border-black': 'bg-dark border-2 border-white'}`}
            onClick={toggleTheme}>
            <img src={theme === 'light' ? '/images/dark.svg' : '/images/light.svg' } 
                alt="image" width={20} height={20} />
        </div>
    )
}