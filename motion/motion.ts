export const buttonSlide = (duration?: number, delay?: number) => {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: duration || 0.3,
        delay: delay || 0,
      },
    },
    exit: { opacity: 0, y: 20 },
    hover: { scale: 1.1 },
  };
};

export const hoverButton = (duration?: number, delay?: number) => {
  return {
    hover: { scale: 1.1 },
  };
};
