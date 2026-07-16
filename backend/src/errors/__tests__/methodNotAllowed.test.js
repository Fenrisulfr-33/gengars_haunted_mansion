const methodNotAllowed = require('../methodNotAllowed');

describe('methodNotAllowed Middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let mockAllowedMethods;

    beforeEach(() => {
        mockRequest = {
            method: '',
            originalUrl: ''
        };
        mockResponse = {};
        mockNext = jest.fn();
    });

    it('should call next with 405 status for GET method', () => {
        mockRequest.method = 'GET';
        mockRequest.originalUrl = '/api/pokemon';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'GET not allowed for /api/pokemon'
        });
    });

    it('should call next with 405 status for POST method', () => {
        mockRequest.method = 'POST';
        mockRequest.originalUrl = '/api/users/123';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'POST not allowed for /api/users/123'
        });
    });

    it('should call next with 405 status for PUT method', () => {
        mockRequest.method = 'PUT';
        mockRequest.originalUrl = '/api/items';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'PUT not allowed for /api/items'
        });
    });

    it('should call next with 405 status for DELETE method', () => {
        mockRequest.method = 'DELETE';
        mockRequest.originalUrl = '/api/resources/456';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'DELETE not allowed for /api/resources/456'
        });
    });

    it('should call next with 405 status for PATCH method', () => {
        mockRequest.method = 'PATCH';
        mockRequest.originalUrl = '/api/settings';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'PATCH not allowed for /api/settings'
        });
    });

    it('should handle root path correctly', () => {
        mockRequest.method = 'POST';
        mockRequest.originalUrl = '/';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'POST not allowed for /'
        });
    });

    it('should handle paths with query parameters', () => {
        mockRequest.method = 'DELETE';
        mockRequest.originalUrl = '/api/search?query=test&limit=10';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'DELETE not allowed for /api/search?query=test&limit=10'
        });
    });

    it('should handle nested paths correctly', () => {
        mockRequest.method = 'PUT';
        mockRequest.originalUrl = '/api/v1/pokemon/national/25';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 405,
            message: 'PUT not allowed for /api/v1/pokemon/national/25'
        });
    });

    it('should always call next exactly once', () => {
        mockRequest.method = 'GET';
        mockRequest.originalUrl = '/test';

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should not modify request or response objects', () => {
        mockRequest.method = 'POST';
        mockRequest.originalUrl = '/test';
        
        const originalRequestMethod = mockRequest.method;
        const originalRequestUrl = mockRequest.originalUrl;
        const responseKeys = Object.keys(mockResponse);

        methodNotAllowed(mockRequest, mockResponse, mockNext);

        // Request should remain unchanged
        expect(mockRequest.method).toBe(originalRequestMethod);
        expect(mockRequest.originalUrl).toBe(originalRequestUrl);
        expect(Object.keys(mockRequest)).toEqual(['method', 'originalUrl']);

        // Response should not be modified at all
        expect(Object.keys(mockResponse)).toEqual(responseKeys);
    });
});
