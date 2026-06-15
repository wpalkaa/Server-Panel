const verifyAdmin = require('../../src/middleware/verifyAdmin');

describe('verifyAdmin', () => {
    let req, res, next;
    
    const MOCK_AUDIENCE = 'http://mock';

    beforeAll(() => {
        process.env = { AUTH0_AUDIENCE: MOCK_AUDIENCE };
    });

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Everything ok - User is admin', () => {
        req.auth = {
            payload: {
                [`${MOCK_AUDIENCE}/group`]: 'admin'
            }
        };

        verifyAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('No claims - checkJwt failed or missing', () => {
        // req.auth undefined
        verifyAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unauthorized - No tokens claims found"
        });
    });

    it('Unauthorized - User is not admin', () => {
        req.auth = {
            payload: {
                [`${MOCK_AUDIENCE}/group`]: 'user' // wrong group
            }
        };

        verifyAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Forbidden - Requires admin group"
        });
    });

    it('Unauthorized - Group property is completely missing', () => {
        req.auth = {
            payload: {
                // No group key
                "some-other-claim": "123"
            }
        };
        
        verifyAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Forbidden - Requires admin group"
        });
    });
});