import { it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { app } from '../src/app';
import request from 'supertest'
import { execSync } from 'child_process';

beforeAll(async () => {
  await app.ready()
})

afterAll(async () =>{
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

it('Should be able to create an user', async () => {
  const response = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)
})