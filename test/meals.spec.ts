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

it('Should be able to create a meal', async () => {
    const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server).post('/meals').set('Cookie', createUser.get('Set-Cookie')).send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)
})

it('Should be able to retrieve all meals', async () =>{
  const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server)
  .post('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)

  const getAllMeals = await request(app.server)
  .get('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)
})

it('Should be able to retrieve specific meal', async () => {
  const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server)
  .post('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)

  const getAllMeals = await request(app.server)
  .get('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)

  const mealId = getAllMeals.body.meals[0].id
  
  await request(app.server)
  .get(`/meals/${mealId}`)
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)

})

it('Should be able to retrieve metrics', async () => {
  const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server)
  .post('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)

  // await request(app.server)
  // .get('/meals')
  // .set('Cookie', createUser.get('Set-Cookie'))
  // .expect(200)

  
  await request(app.server)
  .get(`/meals/metrics`)
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)

})

it('Should be able to delete a meal', async () => {
  const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server)
  .post('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)

  const getAllMeals = await request(app.server)
  .get('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)

  const mealId = getAllMeals.body.meals[0].id

  await request(app.server)
  .delete(`/meals/${mealId}`)
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(204)
})

it('Should be able to update a meal', async () => {
  const createUser = await request(app.server).post('/users').send({
    name:'User Test 01',
    email: 'user.test01@example.com'
  }).expect(201)

  const createMeal = await request(app.server)
  .post('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'Testing Meals',
    mealDescription: 'Test meal',
    isOnDiet: true,
    date: new Date()
  }).expect(201)

  const getAllMeals = await request(app.server)
  .get('/meals')
  .set('Cookie', createUser.get('Set-Cookie'))
  .expect(200)

  const mealId = getAllMeals.body.meals[0].id
  
  await request(app.server)
  .patch(`/meals/${mealId}`)
  .set('Cookie', createUser.get('Set-Cookie'))
  .send({
    mealName:'New meal name',
    mealDescription: 'New meal description',
    date: new Date()
  }).expect(201)
})

