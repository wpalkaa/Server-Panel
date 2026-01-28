const authController = require('../../src/controllers/authController');
const User = require('../../src/models/User');
const isNameValid = require('../../src/utils/isNameValid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User'); // zamienia User na mocka
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/isNameValid');

describe('Auth Controller - Login', () => {
    let req, res;

    // Starting values
    beforeEach(() => {
        req = { 
            body: { 
                login: 'user', 
                password: '12345' 
            } 
        };
        res = {
            status: jest.fn().mockReturnThis(), // to robi że można res.status.json 
            json: jest.fn(),
            cookie: jest.fn()
        };
    });

    it('Everything ok', async () => {
        const mockUser = { 
            _id: '0', 
            login: 'user', 
            password: 'hashed', 
            group: 'user' 
        };
        
        // Mock login actions
        User.findOne.mockResolvedValue(mockUser); 
        bcrypt.compare.mockResolvedValue(true);   
        jwt.sign.mockReturnValue('token');

        await authController.login(req, res); // przekazuje req, res, otrzymuje normalnego responsa przez referencje

        // Validate results
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            user: { 
                login: 'user', 
                group: 'user' 
            }
        }));
        expect(res.cookie).toHaveBeenCalled(); // sprawdza czy wywołało chociaż raz
    });

    it('Invalid password', async () => {
        const mockUser = { 
            login: 'user', 
            password: 'hashed' 
        };
        // Mock login actions
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await authController.login(req, res);

        // validate
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'authRejected'
        }));
    });

    it('User does not exist', async () => {

        User.findOne.mockResolvedValue(null);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'authRejected'
        }));
    });
});

describe('Auth Controller - Register', () => {
    let res, req;

    beforeEach(() => {
        req = {
            body: {
                login: 'user',
                password: '12345',
                group: 'user'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    it('Everything ok', async () => {
        isNameValid.mockResolvedValue(true);
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashed');
        User.create.mockResolvedValue(true);

        await authController.register(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ login: 'user'});
        expect(User.create).toHaveBeenCalledWith({
                login: 'user',
                password: 'hashed',
                group: 'user'
            })

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true
        });
    });

    it('User exists', async () => {
        isNameValid.mockResolvedValue(true);
        User.findOne.mockResolvedValue({ login: 'user' });

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "userExists"
        })
    });

    it('Invalid login length', async () => {
        req.body.login = 'u';

        isNameValid.mockReturnValue(true);

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'invalidLogin'
        });
    });

    it('Invalid login format', async () => {
        isNameValid.mockReturnValue(false);

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'invalidLogin'
        });
    });

    it('Server error', async () => {
        
        isNameValid.mockReturnValue(true);
        User.findOne.mockRejectedValue(new Error());

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'server'
        });
    });
})