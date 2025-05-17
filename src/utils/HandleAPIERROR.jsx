export default function handleApiError(err, setError, fallbackMsg) {
    console.error("Full error object:", err);

    if (err.response) {
        const status = err.response.status;
        console.log("HTTP Status:", status);

        if (status === 404) {
            setError("No results found");
        } else if (status === 500) {
            setError("Server error. Please try again later.");
        } else if (err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError(fallbackMsg);
        }
    } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Check your internet connection.");
    } else {
        console.error("Error", err.message);
        setError("Request failed. Please try again.");
    }
}