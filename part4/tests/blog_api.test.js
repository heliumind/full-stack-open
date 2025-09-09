const assert = require('node:assert')

const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

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
      const newBlog = {
        title: 'newTitle',
        author: 'newAuthor',
        url: 'newurl',
        likes: 4,
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.partialDeepStrictEqual(response.body, newBlog)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('without likes property will default to 0', async () => {
      const newBlog = {
        title: 'newTitle',
        author: 'newAuthor',
        url: 'newurl',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('without title property will not be added', async () => {
      const newBlog = {
        author: 'newAuthor',
        url: 'newurl',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('without url property will not be added', async () => {
      const newBlog = {
        title: 'newTitle',
        author: 'newAuthor',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const urls = blogsAtEnd.map((n) => n.url)
      assert(!urls.includes(blogToDelete.url))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
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
