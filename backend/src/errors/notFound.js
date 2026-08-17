/**
 * @fileoverview Handle 404 Not Found errors for undefined routes.
 * @author Brendan Archer <archer.brendan@proton.me>
 * @version 1.0.0
 * @since 2023-11-01
 * 
 * 1.0.0 - Initial implementation of notFound middleware.
 */

function notFound(request, response, next) {
    next({ status: 404, message: `Path not found: ${request.originalUrl}` });
} 

module.exports = notFound;