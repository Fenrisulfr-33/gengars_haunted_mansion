const errorHandler = require('../errorHandler');

// Mock console methods to keep test output clean
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
};

describe('errorHandler Middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    const originalEnv = process.env;

    beforeEach(() => {
        mockRequest = {
            method: 'GET',
            originalUrl: '/api/test'
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
        // Reset console mocks
        jest.clearAllMocks();
        // Reset environment
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should handle error with custom status and message', () => {
        const error = {
            status: 400,
            message: 'Bad Request'
        };

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        });
    });

    it('should use default status 500 when status is not provided', () => {
        const error = {
            message: 'Custom error message'
        };

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Custom error message'
        });
    });

    it('should use default message when message is not provided', () => {
        const error = {
            status: 403
        };

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Something went wrong!'
        });
    });

    it('should use both defaults when neither status nor message provided', () => {
        const error = {};

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Something went wrong!'
        });
    });

    it('should handle different HTTP status codes correctly', () => {
        const testCases = [
            { status: 400, message: 'Bad Request' },
            { status: 401, message: 'Unauthorized' },
            { status: 403, message: 'Forbidden' },
            { status: 404, message: 'Not Found' },
            { status: 500, message: 'Internal Server Error' },
            { status: 503, message: 'Service Unavailable' }
        ];

        testCases.forEach(({ status, message }) => {
            const error = { status, message };
            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(status);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
        });
    });

    it('should not call next() function', () => {
        const error = {
            status: 400,
            message: 'Test error'
        };

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors with additional properties by ignoring them', () => {
        const error = {
            status: 422,
            message: 'Validation failed',
            extraField: 'should be ignored',
            details: { field: 'username' }
        };

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Validation failed'
        });
    });

    describe('Logging functionality', () => {
        it('should log server errors (status >= 500) with full details', () => {
            const error = {
                status: 500,
                message: 'Internal Server Error',
                stack: 'Error: Internal Server Error\n    at test.js:1:1'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('SERVER ERROR'));
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('GET /api/test'));
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Status 500:'), 'Internal Server Error');
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error: Internal Server Error'));
        });

        it('should log client errors in development mode', () => {
            process.env.NODE_ENV = 'development';
            
            const error = {
                status: 404,
                message: 'Not found'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('404:'), 'Not found');
        });

        it('should not log client errors in production mode', () => {
            process.env.NODE_ENV = 'production';
            
            const error = {
                status: 404,
                message: 'Not found'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(console.log).not.toHaveBeenCalled();
        });
    });

    describe('Development mode features', () => {
        it('should include stack trace in development mode', () => {
            process.env.NODE_ENV = 'development';
            
            const error = {
                status: 400,
                message: 'Bad request',
                stack: 'Error: Bad request\n    at test.js:1:1'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Bad request',
                stack: 'Error: Bad request\n    at test.js:1:1'
            });
        });

        it('should not include stack trace in production mode', () => {
            process.env.NODE_ENV = 'production';
            
            const error = {
                status: 400,
                message: 'Bad request',
                stack: 'Error: Bad request\n    at test.js:1:1'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Bad request'
            });
        });

        it('should not include stack trace when undefined', () => {
            process.env.NODE_ENV = 'development';
            
            const error = {
                status: 400,
                message: 'Bad request'
            };

            errorHandler(error, mockRequest, mockResponse, mockNext);

            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Bad request'
            });
        });
    });
});
