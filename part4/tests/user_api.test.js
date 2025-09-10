const assert = require('node:assert')

const { test, beforeEach, after, describe } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const newUser = {
      name: 'asdf',
      password: 'qwerty',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('`username` is required'))
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const newUser = {
      username: 'asdf',
      name: 'asdf',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('`password` is missing'))
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const newUser = {
      username: 'as',
      password: 'qwerty',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(
      result.body.error.includes(
        'Path `username` (`as`, length 2) is shorter than the minimum allowed length (3'
      )
    )
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const newUser = {
      username: 'asdf',
      password: 'qw',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('must be at least 3 characters long'))
  })
})

after(async () => {
  mongoose.connection.close()
})
