import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notifications)
  if (!notification) {
    return null
  }

  const { message, type } = notification
  return <div className={type}>{message}</div>
}

export default Notification
