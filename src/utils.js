export const normalizeValue = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};
export const convertRange = (value, r1, r2) => {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
};
