const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const blog = {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://localhost.com',
}

const otherBlog = {
  title: 'Second class tests',
  author: 'Robert C. Martin',
  url: 'http://localhost.com',
}

const user = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen',
}

const otherUser = {
  name: 'Arto Hellas',
  username: 'hellas',
  password: 'hellas',
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: user })
    await request.post('/api/users', { data: otherUser })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('suceeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blog)
      await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, blog)
      const newBlog = page
        .getByText(`${blog.title} ${blog.author}`)
        .locator('..')
      await newBlog.getByRole('button', { name: 'view' }).click()
      await expect(newBlog.getByText('0')).toBeVisible()
      await newBlog.getByRole('button', { name: 'like' }).click()
      await expect(newBlog.getByText('1')).toBeVisible()
    })

    test('can delete own blog', async ({ page }) => {
      await createBlog(page, blog)
      const newBlog = page
        .getByText(`${blog.title} ${blog.author}`)
        .locator('..')

      await newBlog.getByRole('button', { name: 'view' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await newBlog.getByRole('button', { name: 'remove' }).click()

      await expect(
        newBlog.getByText(`${blog.title} ${blog.author}`)
      ).not.toBeVisible()
      await expect(newBlog).toHaveCount(0)
    })

    test('cannot delete blog of other user', async ({ page }) => {
      await createBlog(page, blog)
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, otherUser.username, otherUser.password)

      const newBlog = page
        .getByText(`${blog.title} ${blog.author}`)
        .locator('..')

      await newBlog.getByRole('button', { name: 'view' }).click()
      await expect(
        newBlog.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    test('blog with more likes are shown first', async ({ page }) => {
      await createBlog(page, blog)
      await createBlog(page, otherBlog)

      const popularBlog = page
        .getByText(`${otherBlog.title} ${otherBlog.author}`)
        .locator('..')
      await popularBlog.getByRole('button', { name: 'view' }).click()
      await popularBlog.getByRole('button', { name: 'like' }).click()

      const listBlogs = await page.getByTestId('blog card')
      await expect(listBlogs.first()).toContainText(otherBlog.title)
    })
  })
})
