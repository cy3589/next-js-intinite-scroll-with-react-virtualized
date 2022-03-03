interface Props {
  func1: (n: number) => void;
}

const func = ({ func1 }: Props) => {
  func1(1);
  const x = (a, b, c) => {};
  x(1, 2, 3);
};

export default func;
