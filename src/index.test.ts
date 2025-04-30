import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import { app } from './index';

describe('Express Application Tests', () => {
    let server: express.Application;

    beforeAll(() => {
        server = app;
    });

    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const response = await request(server)
                .get('/users')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual([
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]);
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'New User',
                email: 'new@example.com'
            };

            const response = await request(server)
                .post('/users')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                ...newUser
            });
        });

        it('should return 400 for invalid user data', async () => {
            const invalidUser = {
                name: 'Invalid User'
                // Missing email field
            };

            await request(server)
                .post('/users')
                .send(invalidUser)
                .expect(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a specific user', async () => {
            const response = await request(server)
                .get('/users/1')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com'
            });
        });

        it('should return 404 for non-existent user', async () => {
            await request(server)
                .get('/users/999')
                .expect(404);
        });
    });

    describe('Error Handling', () => {
        it('should handle /error route correctly', async () => {
            const response = await request(server)
                .get('/error')
                .expect(500);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Test error');
        });
    });

    describe('Middleware Tests', () => {
        it('should parse JSON request body', async () => {
            const testData = { test: 'data' };
            
            const response = await request(server)
                .post('/test-json')
                .send(testData)
                .expect(200);

            expect(response.body).toEqual(testData);
        });
    });
}); 