import type { CoursePart } from '../App';

interface PartProps {
  course: CoursePart;
}

const renderCourseHeader = (course: CoursePart) => (
  <strong>
    {course.name} {course.exerciseCount}
  </strong>
);

const Part = ({ course }: PartProps) => {
  switch (course.kind) {
    case 'basic':
      return (
        <p>
          {renderCourseHeader(course)}
          <br />
          <em>{course.description}</em>
        </p>
      );
    case 'group':
      return (
        <p>
          {renderCourseHeader(course)}
          <br />
          project exercises {course.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          {renderCourseHeader(course)}
          <br />
          <em> {course.description}</em>
          <br />
          <a href={course.backgroundMaterial}>background material</a>
        </p>
      );
    case 'special':
      return (
        <p>
          {renderCourseHeader(course)}
          <br />
          <em> {course.description}</em>
          <br />
          required skills: {course.requirements.join(', ')}
        </p>
      );
    default:
      break;
  }
};

export default Part;
