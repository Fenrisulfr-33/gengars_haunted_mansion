/**
 * @fileoverview Handle 405 Method Not Allowed errors for unsupported HTTP methods.
 * @author Brendan Archer <archer.brendan@proton.me>
 * @version 2.0.0
 * @since 2023-11-01
 * 
 * 1.0.0 - Initial implementation of methodNotAllowed middleware.
 * 2.0.0 - Updated documentation and added allowedMethods property to error object.
 */

function methodNotAllowed(request, response, next, allowedMethods) {
    console.log(`Method Not Allowed: ${request.method} ${request.originalUrl}`);
    console.log(`Allowed Methods: ${allowedMethods}`);
    next({
        status: 405,
        message: `${request.method} not allowed for ${request.originalUrl}`,
        allowedMethods: allowedMethods.join(', ')
    });
}

module.exports = methodNotAllowed;