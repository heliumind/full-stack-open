const { test, describe } = require('node:test')
const assert = require('node:assert')
const { dummy, totalLikes, favoriteBlog } = require('../utils/list_helper')

const blogs = require('./fixtures/blog_list.json')
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, listWithOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite Blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })

  test('when list has only one blog, equals that blog', () => {
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of a bigger list returns the right blog', () => {
    const result = favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })
})
