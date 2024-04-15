export const toMinutesAndSeconds = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  return `${minutes} min : ${seconds} sec`;
};
