export function parsePositiveInt(value) {
  const number = Number(value);

  if (Number.isInteger(number) && number > 0) {
    return number;
  }

  return null;
}
