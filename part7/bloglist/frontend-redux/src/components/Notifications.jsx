import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'

const Notification = () => {
  const notification = useSelector((state) => state.notifications)
  if (!notification) {
    return null
  }

  const { message, type } = notification
  return <Alert variant={type}>{message}</Alert>
}

export default Notification
