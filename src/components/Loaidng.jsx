import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="p-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md h-fit">
            <motion.div
                className="flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1,
                }}
            >
                <motion.div
                    className="w-4 h-4 bg-blue-500 rounded-full"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{ 
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0,
                    }}
                />
                <motion.div
                    className="w-4 h-4 bg-blue-500 rounded-full"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.2,
                    }}
                />
                <motion.div
                    className="w-4 h-4 bg-blue-500 rounded-full"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.4,
                    }}
                />
            </motion.div>
        </div>
    );
};

export default Loading;