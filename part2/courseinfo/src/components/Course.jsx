const Course = ({ course }) => (
  <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
  </div>
)

const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({ parts }) => (
  <b>
    total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises
  </b>
)

export default Course
