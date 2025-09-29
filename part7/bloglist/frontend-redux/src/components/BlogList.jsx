import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const blogs = useSelector(({ blogs }) => blogs)
  return (
    <div>
      {blogs.map((blog) => (
        <div style={blogStyle} key={blog.id}>
          <span>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </span>
        </div>
      ))}
    </div>
  )
}

export default BlogList
