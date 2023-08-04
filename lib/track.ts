// converts the time to format 0:00
export const convertTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
  return { formattedTime, minutes, remainingSeconds };
};


export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
  const randomPart = Math.floor(Math.random() * 1000000).toString(16); // Generate a random number and convert to hexadecimal
  return `${timestamp}-${randomPart}`;
};

