import Blog from './Blog'
import { useSelector } from 'react-redux'

const BlogList = ({ user }) => {
  const blogs = useSelector(({ blogs }) => blogs)
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
