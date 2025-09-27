import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://localhost.com',
  likes: 100,
  user: {
    id: 'hellas',
  },
}

const User = {
  id: 'hellas',
  name: 'hellas',
}

test('content before clicking view button', () => {
  render(<Blog blog={blog} />)

  screen.getByText(`${blog.title} ${blog.author}`)

  const url = screen.queryByText(blog.url)
  expect(url).toBeNull()
  const likes = screen.queryByText(blog.likes.toString())
  expect(likes).toBeNull()
})

test('content after clicking view button', async () => {
  render(<Blog blog={blog} user={User} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText(blog.url)
  screen.getByText(blog.likes.toString())
})

test('like button triggers event Handler', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={User} addLikes={mockHandler} />)

  const user = userEvent.setup()
  let button = screen.getByText('view')
  await user.click(button)

  const likePresses = 2
  for (let i = 0; i < likePresses; i++) {
    button = screen.getByText('like')
    await user.click(button)
  }

  expect(mockHandler.mock.calls).toHaveLength(likePresses)
})
