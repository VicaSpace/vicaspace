/**
 * Check if string is Numeric
 * @param value Value
 * @returns If value is numeric?
 */
export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};
