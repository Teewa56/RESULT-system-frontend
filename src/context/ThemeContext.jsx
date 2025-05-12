import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useState, createContext } from 'react'

const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
    ThemeProvider.propTypes = {
        children: PropTypes.node.isRequired,
    }
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ? 
            localStorage.getItem('theme') : 'light'
    });
    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    },[theme])
    function toggleTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeProvider, ThemeContext };