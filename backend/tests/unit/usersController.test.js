const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

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
                message: 'server'
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
});