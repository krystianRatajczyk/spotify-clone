import { useEffect, useState } from "react";

const useHover = (ref: React.RefObject<any>) => {
  const [isHover, setIsHover] = useState(false);
  
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsHover(true);
    };

    const handleMouseLeave = () => {
      setIsHover(false);
    };

    const element = ref.current;

    if (element) {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return [isHover];
};

export default useHover;
