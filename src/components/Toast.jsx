import { useState, useEffect } from "react";

const Toast = ({ text, color }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false); 
        }, 3000);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div
            className={`absolute top-4  transition-all duration-500 ease-in-out transform ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
            } bg-red-300 px-7 py-3 rounded-md shadow-md`}
        >
            <p className={`text-${color}`} >{text}</p>
        </div>
    );
};

export default Toast;