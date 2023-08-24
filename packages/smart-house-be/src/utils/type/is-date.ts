export const isDate = (date: string): boolean => {
  if (!date) {
    return;
  }
  return !Number.isNaN(new Date(date).valueOf());
};
