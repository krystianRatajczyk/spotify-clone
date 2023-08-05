export const darkenColor = (hexColor: string, amount: number): string => {
  // Remove the "#" symbol from the beginning if it's present
  hexColor = hexColor.replace("#", "");

  // Parse the hex color into its RGB components
  const red = parseInt(hexColor.substring(0, 2), 16);
  const green = parseInt(hexColor.substring(2, 4), 16);
  const blue = parseInt(hexColor.substring(4, 6), 16);

  // Calculate the darker values for each component
  const darkerRed = Math.max(0, red - amount);
  const darkerGreen = Math.max(0, green - amount);
  const darkerBlue = Math.max(0, blue - amount);

  // Convert the darker RGB components back to hex
  const darkerHex =
    "#" +
    darkerRed.toString(16).padStart(2, "0") +
    darkerGreen.toString(16).padStart(2, "0") +
    darkerBlue.toString(16).padStart(2, "0");

  return darkerHex;
};
