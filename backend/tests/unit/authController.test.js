const authController = require('../../src/controllers/authController');
const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User'); // zamienia User na mocka
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

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

    it('Login and password valid, send sesssion cookie', async () => {
        const mockUser = { 
            _id: '0', 
            login: 'user', 
            password: 'hashed', 
            role: 'user' 
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
                role: 'user' 
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
});

describe('Auth Controller - Register', () => {
    
})