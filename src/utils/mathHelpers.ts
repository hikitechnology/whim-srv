export function closestNumber(target: number, numbers: number[]) {
  return numbers.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
  );
}
