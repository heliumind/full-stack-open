import { useState } from 'react'
import { sum, average, positiveRatio } from './utils'


const Button = ({ text, onClick }) => <button onClick={onClick} >{text}</button>

const StatisticsLine = ({ text, value }) => <div>{text} {value}</div>

const Statistics = ({ good, neutral, bad, allFeedback }) => {
  if (allFeedback.length === 0) {
    return (
      <div>
        <h1>statistics</h1>
        No feedback given
      </div>
    )
  }
  return ( 
    <div>
      <h1>statistics</h1>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="all" value={sum(allFeedback)} />
      <StatisticsLine text="average" value={average(allFeedback)} />
      <StatisticsLine text="positive" value={`${positiveRatio(allFeedback)} %`} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allFeedback, setAll] = useState([])
  
  const setState = (value, feedback, setFunc) => () => {
    setFunc(value)
    setAll(allFeedback.concat(feedback))
  }
  
  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button text="good" onClick={setState(good + 1, 1, setGood)} />
        <Button text="neutral" onClick={setState(neutral + 1, 0, setNeutral)} />
        <Button text="bad" onClick={setState(bad + 1, -1, setBad)}/>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} allFeedback={allFeedback} />
    </div>
  )
}

export default App
