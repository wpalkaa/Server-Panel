const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authController = require('../../src/controllers/authController');
const authRoutes = require('../../src/routes/authRoutes')
const User = require('../../src/models/User');
const { isNameValid } = require('../../src/utils/files');


jest.mock('../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/files');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes)

describe('/api/auth', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        const reqBody = { 
            login: 'user', 
            password: '12345' 
        };

        it('Everything ok', async () => {
            const mockUser = { 
                _id: '1',
                login: 'user',
                password: 'hashed',
                group: 'user'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            const r = await request(app).post('/api/auth/login').send(reqBody);

            expect(r.statusCode).toBe(200);
            expect(r.body.success).toBe(true);
            expect(r.body.user).toMatchObject({ login: 'user', group: 'user' });
            expect(r.headers['set-cookie'][0]).toContain('user_session=token');
        });

        it('User not found', async () => {
            User.findOne.mockResolvedValue(null);

            const r = await request(app).post('/api/auth/login').send(reqBody);

            expect(r.statusCode).toBe(401);
            expect(r.body.success).toBe(false);
            expect(r.body.message).toBe('authRejected');
        });

        it('Wrong password', async () => {
            const mockUser = { 
                login: 'user', 
                password: 'hashed' 
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const r = await request(app).post('/api/auth/login').send(reqBody);

            expect(r.statusCode).toBe(401);
            expect(r.body.success).toBe(false);
            expect(r.body.message).toBe('authRejected');
        });

        it('Server error', async () => {
        
            User.findOne.mockRejectedValue(new Error());

            const res = await request(app).post('/api/auth/login').send(reqBody);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('server');
        });
    });



    describe('POST /api/auth/register', () => {
        const reqBody = { 
            login: 'user', 
            password: '12345', 
            group: 'user' 
        };

        it('Everything ok', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed');
            User.create.mockResolvedValue({ 
                login: 'user', 
                password: 'hashed',
                group: 'user'
            });
            isNameValid.mockReturnValue(true);

            const res = await request(app).post('/api/auth/register').send(reqBody);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);

            expect(bcrypt.hash).toHaveBeenCalledWith('12345', 10);
            expect(User.create).toHaveBeenCalledWith({
                login: 'user',
                password: 'hashed',
                group: 'user'
            });
        });

        it('Invalid login provided', async () => {
            isNameValid.mockReturnValue(false);

            const res = await request(app).post('/api/auth/register').send(reqBody);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('invalidLogin');
        });

        it('User already exists', async () => {
            User.findOne.mockResolvedValue({ login: 'user' });
            isNameValid.mockReturnValue(true);

            const res = await request(app).post('/api/auth/register').send(reqBody);

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('userExists');
        });

        it('Server error', async () => {
            User.findOne.mockRejectedValue(new Error());
            isNameValid.mockReturnValue(true);

            const res = await request(app).post('/api/auth/register').send(reqBody);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('server');
        });
    });
});
