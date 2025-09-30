import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <ListGroup>
      {blogs.map((blog) => (
        <ListGroup.Item key={blog.id}>
          <span>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default BlogList
