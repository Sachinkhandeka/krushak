export const fetchWithAuth = async (
    endpoint,
    options = {},
    setLoading,
    setAlert,
    navigate,
    retry = false
) => {
    try {
        setLoading(true);

        // Make the API request
        const response = await fetch(endpoint, {
            ...options,
            credentials: "include",
        });

        const data = await response.json(); 

        if (response.status === 401 && (data.message === "jwt expired" || data.message === "Unauthorized user request")) {
            if (retry) {
                setAlert({ type: "error", message: "Session expired. Please log in again." });
                navigate("/login");
                return { success: false, message: "Session expired" };
            }

            // Refresh token
            const refreshResponse = await fetch("/api/v1/users/refresh-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!refreshResponse.ok) {
                setAlert({ type: "error", message: "Failed to refresh session. Please log in again." });
                navigate("/login");
                return { success: false, message: "Token refresh failed" };
            }

            // Retry the original request after refreshing the token
            return await fetchWithAuth(endpoint, options, setLoading, setAlert, navigate, true);
        }

        // Properly handle API errors
        if (!response.ok) {
            setAlert({ type: "error", message: data.message });
            return;
            
        }

        return data; 
    } catch (error) {
        setAlert({ type: "error", message: error.message || "Network error. Please try again." });
        return
    } finally {
        setLoading(false);
    }
};
