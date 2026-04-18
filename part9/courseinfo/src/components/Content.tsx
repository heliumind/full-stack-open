import type { CoursePart } from '../App';
import Part from './Part';

interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => (
  <div>
    {parts.map((part: CoursePart) => (
      <Part course={part} />
    ))}
  </div>
);

export default Content;
