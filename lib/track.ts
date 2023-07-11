// converts the time to format 0:00
export const convertTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
};
