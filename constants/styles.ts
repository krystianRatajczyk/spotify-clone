import { darkenColor } from "@/lib/darkerColor";
import { darkerAmount } from "./dummyData";

export const getUpGradient = (
  dominantColor: string | undefined,
): { backgroundImage: string } => {
  return {
    backgroundImage: dominantColor
      ? `linear-gradient(to bottom, ${dominantColor}, ${darkenColor(
          dominantColor,
          darkerAmount
        )} )`
      : "linear-gradient(to bottom, #5e5c5c ,#333333 )",
  };
};

export const getDownGradient = (
  dominantColor: string | undefined,
): { backgroundImage: string } => {
  return {
    backgroundImage: dominantColor
      ? `linear-gradient(to bottom, ${darkenColor(
          dominantColor,
          darkerAmount + 10
        )} 0, #121212 175px)`
      : `linear-gradient(to bottom, #242424, #121212 150px)`,
  };
};
