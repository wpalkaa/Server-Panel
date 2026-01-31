const jwt = require('jsonwebtoken');
const verifyAdmin = require('../../src/middleware/verifyAdmin')

jest.mock('jsonwebtoken');




describe('verifyAdmin', () => {
    let req, res, next;

    beforeEach( () => {
        req = {
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach( () => {
        jest.clearAllMocks();
    });


    it('Everything ok', () => {
        req.cookies.user_session = 'token';
        jwt.verify.mockReturnValue({ group: 'admin' })

        verifyAdmin(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    })

    it('No session cookie', () => {
        verifyAdmin(req, res, next);

        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unauthenticated"
        })
    })

    it('Unauthorized', () => {
        req.cookies.user_session = 'token';
        jwt.verify.mockReturnValue({ group: "user" });

        verifyAdmin(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized'
        });
    });

    it('Something else', () => {
        req.cookies.user_session = 'token';
        jwt.verify.mockImplementation( () => {throw new Error()} );
        
        verifyAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized'
        });
    })
})
