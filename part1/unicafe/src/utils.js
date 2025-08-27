const sum = arr => arr.reduce((acc, cur) => acc + cur, 0)
const average = arr => sum(arr) / arr.length

const positiveRatio = arr => {
  const positiveCount = sum(arr.filter((rating) => rating === 1))
  return (positiveCount / arr.length) * 100
}

export { sum, average, positiveRatio }
