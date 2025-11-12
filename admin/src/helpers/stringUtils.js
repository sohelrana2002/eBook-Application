export const capitalizedWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
