const assert = require('node:assert')

const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const validUser = {
  username: 'root',
  password: 'sekret',
}

const invalidUser = {
  username: 'asdf',
  password: 'qwerty',
}

const newBlog = {
  title: 'newTitle',
  author: 'newAuthor',
  url: 'http://example.com',
  likes: 4,
}

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(validUser.password, 10)
  const user = new User({ username: validUser.username, passwordHash })

  await user.save()
})

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs/')
    const titles = response.body.map((e) => e.title)
    assert(titles.includes(helper.initialBlogs[0].title))
  })

  test('the unique identifier property of blogs is named id', async () => {
    const blogs = await helper.blogsInDb()
    assert(blogs[0].id)
    assert(!blogs[0]._id)
  })

  describe('viewing a specific blog', () => {
    test('a valid blog can be added by authorized users', async () => {
      const loginUser = await api.post('/api/login').send(validUser)

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      assert.partialDeepStrictEqual(response.body, newBlog)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('a blog cannot be added without providing a token', async () => {
      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog cannot be added by unauthorized users', async () => {
      const loginUser = await api.post('/api/login').send(invalidUser)

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const reactPatterns = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${reactPatterns.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, reactPatterns)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('is properly saved', async () => {
      const loginUser = await api.post('/api/login').send(validUser)

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.partialDeepStrictEqual(response.body, newBlog)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('without likes property will default to 0', async () => {
      const loginUser = await api.post('/api/login').send(validUser)
      const { likes, ...rest } = newBlog
      const blogWithoutLikes = { ...rest }

      const response = await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('without title property will not be added', async () => {
      const loginUser = await api.post('/api/login').send(validUser)
      const { title, ...rest } = newBlog
      const blogWithoutTitle = { ...rest }

      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('without url property will not be added', async () => {
      const loginUser = await api.post('/api/login').send(validUser)
      const { url, ...rest } = newBlog
      const blogWithoutUrl = { ...rest }

      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('from authorized user succeeds with status code 204 if id is valid', async () => {
      const loginUser = await api.post('/api/login').send(validUser)
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(201)

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const urls = blogsAtEnd.map((n) => n.url)
      assert(!urls.includes(newBlog))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating of a blog', () => {
    test('if id is valid suceeds', async () => {
      const blogsAtStart = await helper.blogsInDb()
      let blogToUpdate = blogsAtStart[0]
      const newBlog = {
        title: 'newTitle',
        author: 'newAuthor',
        url: 'newurl',
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)

      assert.partialDeepStrictEqual(response.body, newBlog)
    })

    test('if id is valid fails with 404', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.put(`/api/blogs/${validNonexistingId}`).send({}).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
