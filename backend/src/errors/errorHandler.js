/**
 * @fileoverview Handle error responses for the application.
 * @author Brendan Archer <archer.brendan@proton.me>
 * @version 2.0.0
 * @since 2023-11-01
 * 
 * 1.0.0 - Initial implementation of error handler middleware.
 * 2.0.0 - Added enhanced logging and environment-specific features.
 */

require('colors');

/**
 * Enhanced error handler middleware with logging and environment-specific features
 * @param {Object} error - Error object with status and message properties
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(error, request, response, next) {
    const { status = 500, message = "Something went wrong!" } = error;
    
    // Log errors for debugging
    const timestamp = new Date().toISOString();
    if (status >= 500) {
        // Server errors - log everything
        console.error(`[${timestamp}] SERVER ERROR`.red.bold);
        console.error(`${request.method} ${request.originalUrl}`.yellow);
        console.error(`Status ${status}:`.red, message);
        if (error.stack) {
            console.error(error.stack);
        }
    } else if (process.env.NODE_ENV === 'development') {
        // Client errors - log in development only
        console.log(`[${timestamp}] ${status}:`.yellow, message);
    }
    
    // Build response
    const errorResponse = { error: message };
    
    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
        errorResponse.stack = error.stack;
    }
    
    response.status(status).json(errorResponse);
}

module.exports = errorHandler;
