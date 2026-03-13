interface ContentProps {
  parts: Course[];
}

interface Course {
  name: string;
  exerciseCount: number;
}

const Content = ({ parts }: ContentProps) => (
  <div>
    {parts.map((course: Course) => (
      <p>
        {course.name} {course.exerciseCount}
      </p>
    ))}
  </div>
);

export default Content;
