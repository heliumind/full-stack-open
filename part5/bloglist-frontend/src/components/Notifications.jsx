const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const { type, message } = notification
  return <div className={type}>{message}</div>
}

export default Notification
