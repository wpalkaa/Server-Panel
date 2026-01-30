const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const usersRoutes = require('../../src/routes/usersRoutes');
const usersController = require('../../src/controllers/usersController');
const verifyAdmin = require('../../src/middleware/verifyAdmin');


// Express app for tests
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', usersRoutes);

jest.mock('../../src/controllers/usersController');
jest.mock('../../src/middleware/verifyAdmin');

describe('/api/users', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        afterEach(() => jest.clearAllMocks());

        it('Everythin ok', async () => {
            usersController.getUsers.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: [{ login: 'user1' }, { login: 'user2' }]
                });
            });

            const r = await request(app).get('/api/users');

            expect(r.statusCode).toBe(200);
            expect(r.body.success).toBe(true);
            expect(r.body.data).toMatchObject([{ login: 'user1' }, { login: 'user2' }]);
        });

        it('Server error', async () => {
            usersController.getUsers.mockImplementation((req, res) => {
                res.status(500).json({ 
                    success: false, 
                    message: 'server' 
                });
            });

            const r = await request(app).get('/api/users');

            expect(r.statusCode).toBe(500);
            expect(r.body.success).toBe(false);
        });
    });


    describe('GEET /api/users/:login', () => {
        afterEach(() => jest.clearAllMocks());

        it('Everything ok', async () => {
            usersController.getUserData.mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    data: { login: 'admin', role: 'admin' }
                });
            });

            const r = await request(app).get('/api/users/admin');

            expect(r.statusCode).toBe(200);
            expect(r.body.success).toBe(true);
            expect(r.body.data).toMatchObject({ login: 'admin', role: 'admin'} );
        });

        it('User not found', async () => {
            usersController.getUserData.mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'userNotFound'
                });
            });

            const r = await request(app).get('/api/users/djaiwodjaiowd');

            expect(r.statusCode).toBe(404);
            expect(r.body.success).toBe(false);
            expect(r.body.message).toBe('userNotFound');
        });
    });


    describe('DELETE /api/users/:id', () => {
        afterEach(() => jest.clearAllMocks());

        beforeEach(() => {
            verifyAdmin.mockImplementation((req, res, next) => {
                next();
            });
        });

        it('Everything ok', async () => {
            usersController.deleteUser.mockImplementation((req, res) => {
                res.status(200).json( { success: true } );
            });

            const r = await request(app).delete('/api/users/delete/1');

            expect(r.statusCode).toBe(200);
            expect(r.body.success).toBe(true);
        });

        it('Unaithorized request', async () => {
            verifyAdmin.mockImplementationOnce( (req, res, next) => {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized'
                })
            })

            const r = await request(app).delete('/api/users/delete/1');expect(r.statusCode).toBe(403);

            expect(r.statusCode).toBe(403);
            expect(r.body.success).toBe(false);
            expect(r.body.message).toBe('Unauthorized');
            
            expect(usersController.deleteUser).not.toHaveBeenCalled();            
        })

        it('User not found', async () => {
            usersController.deleteUser.mockImplementation((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'userNotFound'
                });
            });

            const r = await request(app).delete('/api/users/delete/inoberte');

            expect(r.statusCode).toBe(404);
            expect(r.body.success).toBe(false);
            expect(r.body.message).toBe('userNotFound')
        });
    });
})