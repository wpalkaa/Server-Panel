const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');
const { isNameValid } = require('../../src/utils/files');

const bcrypt = require('bcryptjs');

jest.mock('../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/files');



describe('Users Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getUsers', () => {
        it('Everything ok', async () => {
            const mockUsers = [{ login: 'user1' }, { login: 'user2' }];
            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            await usersController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUsers
            });
        });

        it('Server error', async () => {
            User.find.mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error())
            });

            await usersController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'server'
            });
        });
    });


    describe('getUserData', () => {
        it('Everything ok', async () => {
            req.params.login = 'user';
            const mockUser = { login: 'user', role: 'user' };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await usersController.getUserData(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ login: 'user' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('User not found', async () => {
            req.params.login = 'hjpiet';
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await usersController.getUserData(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'userNotFound'
            });
        });

        it('Server error', async () => {
            User.findOne.mockImplementation(() => { throw new Error(); });

            await usersController.getUserData(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'server'
            })
        });
    });


    describe('deleteUser', () => {

        it('Everything ok', async () => {
            req.params.id = '1';
            User.findByIdAndDelete.mockResolvedValue({ _id: '1', login: 'user' });

            await usersController.deleteUser(req, res);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true });
        });

        it('User does not exist', async () => {
            req.params.id = '-12daw';
            User.findByIdAndDelete.mockResolvedValue(null);

            await usersController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'userNotFound'
            });
        });

        it('Server error', async () => {
            User.findByIdAndDelete.mockRejectedValue(new Error());

            await usersController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'server'
            })
        });
    });



    describe('Users controller - Create user', () => {
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

            await usersController.createUser(req, res);

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

            await usersController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "userExists"
            })
        });

        it('Invalid login length', async () => {
            req.body.login = 'u';

            isNameValid.mockReturnValue(true);

            await usersController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'invalidLogin'
            });
        });

        it('Invalid login format', async () => {
            isNameValid.mockReturnValue(false);

            await usersController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'invalidLogin'
            });
        });

        it('Server error', async () => {
            
            isNameValid.mockReturnValue(true);
            User.findOne.mockRejectedValue(new Error());

            await usersController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'server'
            });
        });
    })
});