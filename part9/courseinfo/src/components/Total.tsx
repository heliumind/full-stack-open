interface TotalProps {
  number: number;
}

const Total = ({ number }: TotalProps) => <p>Number of exercises {number}</p>;

export default Total;
