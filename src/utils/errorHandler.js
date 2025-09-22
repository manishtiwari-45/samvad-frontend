/**
 * Secure Frontend Error Handler for SAMVAD
 * Prevents exposure of backend error details to users
 */

export class SecureErrorHandler {
    // User-friendly error messages for different HTTP status codes
    static statusMessages = {
        400: "Invalid request. Please check your input and try again.",
        401: "Please log in to continue.",
        403: "You don't have permission to perform this action.",
        404: "The requested resource was not found.",
        409: "This action conflicts with existing data. Please refresh and try again.",
        413: "File too large. Please choose a smaller file.",
        422: "Invalid data provided. Please check your input.",
        429: "Too many requests. Please wait a moment and try again.",
        500: "Server error. Please try again later.",
        502: "Service temporarily unavailable. Please try again later.",
        503: "Service temporarily unavailable. Please try again later.",
        504: "Request timeout. Please try again."
    };

    // Specific error messages for common scenarios
    static scenarioMessages = {
        upload: "File upload failed. Please try again with a valid image file.",
        login: "Login failed. Please check your credentials and try again.",
        signup: "Account creation failed. Please check your information and try again.",
        network: "Network error. Please check your connection and try again.",
        permission: "You don't have permission to perform this action.",
        validation: "Please check your input and try again.",
        timeout: "Request timed out. Please try again."
    };

    /**
     * Handle API errors securely
     * @param {Error} error - The error object from API call
     * @param {string} scenario - Optional scenario context (upload, login, etc.)
     * @returns {string} User-friendly error message
     */
    static handleApiError(error, scenario = null) {
        // Log the actual error for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', error);
        }

        // If we have a scenario-specific message, use it
        if (scenario && this.scenarioMessages[scenario]) {
            return this.scenarioMessages[scenario];
        }

        // Handle network errors
        if (!error.response) {
            return this.scenarioMessages.network;
        }

        // Get status code
        const status = error.response?.status;

        // Return user-friendly message based on status code
        return this.statusMessages[status] || "An unexpected error occurred. Please try again.";
    }

    /**
     * Handle file upload errors specifically
     * @param {Error} error - The error object
     * @returns {string} User-friendly error message
     */
    static handleUploadError(error) {
        const status = error.response?.status;
        
        if (status === 413 || status === 400) {
            // Check if it's a file size or validation error
            const detail = error.response?.data?.detail || "";
            if (detail.includes("size") || detail.includes("large")) {
                return "File too large. Please choose a file smaller than 5MB.";
            }
            if (detail.includes("type") || detail.includes("format")) {
                return "Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.";
            }
        }

        return this.handleApiError(error, 'upload');
    }

    /**
     * Handle authentication errors
     * @param {Error} error - The error object
     * @returns {string} User-friendly error message
     */
    static handleAuthError(error) {
        const status = error.response?.status;
        
        if (status === 401) {
            return "Invalid credentials. Please check your email and password.";
        }
        
        if (status === 403) {
            return "Access denied. Please contact an administrator.";
        }

        return this.handleApiError(error, 'login');
    }

    /**
     * Handle form validation errors
     * @param {Error} error - The error object
     * @returns {string} User-friendly error message
     */
    static handleValidationError(error) {
        const status = error.response?.status;
        
        if (status === 422 || status === 400) {
            return "Please check your input and try again.";
        }

        return this.handleApiError(error, 'validation');
    }

    /**
     * Show error to user (can be customized based on UI framework)
     * @param {string} message - Error message to display
     * @param {string} title - Optional error title
     */
    static showError(message, title = "Error") {
        // This can be customized based on your notification system
        // For now, using alert as fallback
        if (typeof window !== 'undefined') {
            alert(`${title}: ${message}`);
        }
    }

    /**
     * Safe error logging (only logs in development)
     * @param {Error} error - Error to log
     * @param {string} context - Context where error occurred
     */
    static logError(error, context = "Unknown") {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${context}] Error:`, error);
        }
    }
}

// Export as default for easier importing
export default SecureErrorHandler;
