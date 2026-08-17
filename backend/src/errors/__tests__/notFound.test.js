const notFound = require('../notFound');

describe('notFound Middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;

    beforeEach(() => {
        mockRequest = {
            originalUrl: ''
        };
        mockResponse = {};
        mockNext = jest.fn();
    });

    it('should call next with 404 status and correct message', () => {
        mockRequest.originalUrl = '/api/unknown';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /api/unknown'
        });
    });

    it('should handle root path', () => {
        mockRequest.originalUrl = '/';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /'
        });
    });

    it('should handle nested paths', () => {
        mockRequest.originalUrl = '/api/v1/pokemon/national/999';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /api/v1/pokemon/national/999'
        });
    });

    it('should handle paths with query parameters', () => {
        mockRequest.originalUrl = '/api/search?name=pikachu&type=electric';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /api/search?name=pikachu&type=electric'
        });
    });

    it('should handle paths with hash fragments', () => {
        mockRequest.originalUrl = '/page#section';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /page#section'
        });
    });

    it('should handle paths with special characters', () => {
        mockRequest.originalUrl = '/api/pokemon/Mr.%20Mime';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith({
            status: 404,
            message: 'Path not found: /api/pokemon/Mr.%20Mime'
        });
    });

    it('should always call next exactly once', () => {
        mockRequest.originalUrl = '/test-path';

        notFound(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should always return 404 status regardless of path', () => {
        const paths = [
            '/api/pokemon',
            '/users/profile',
            '/admin/dashboard',
            '/nonexistent',
            '/api/v2/resources'
        ];

        paths.forEach(path => {
            mockRequest.originalUrl = path;
            mockNext.mockClear();

            notFound(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({ status: 404 })
            );
        });
    });

    it('should not modify request or response objects', () => {
        mockRequest.originalUrl = '/test';
        
        const originalUrl = mockRequest.originalUrl;
        const responseKeys = Object.keys(mockResponse);

        notFound(mockRequest, mockResponse, mockNext);

        // Request should remain unchanged
        expect(mockRequest.originalUrl).toBe(originalUrl);
        expect(Object.keys(mockRequest)).toEqual(['originalUrl']);

        // Response should not be modified at all
        expect(Object.keys(mockResponse)).toEqual(responseKeys);
    });

    it('should include the full original URL in error message', () => {
        mockRequest.originalUrl = '/api/pokemon/national/25/ruby-sapphire';

        notFound(mockRequest, mockResponse, mockNext);

        const callArg = mockNext.mock.calls[0][0];
        expect(callArg.message).toContain('/api/pokemon/national/25/ruby-sapphire');
        expect(callArg.message).toBe('Path not found: /api/pokemon/national/25/ruby-sapphire');
    });
});
