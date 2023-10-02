import { useEffect, useState } from "react";

const useGrid = (def: number, cardWidth: number, ref: React.RefObject<any>) => {
  const [amount, setAmount] = useState<number>(def);

  useEffect(() => {
    const calculateGrid = () => {
      if (ref.current) {
        const parentWidth = ref.current.clientWidth;
        const calculatedGridCols = Math.floor(parentWidth / cardWidth);

        setAmount(calculatedGridCols);
      }
    };
    calculateGrid();
    
    window.addEventListener("resize", calculateGrid);

    // Use a ResizeObserver to monitor changes in the parent div's size
    const resizeObserver = new ResizeObserver(calculateGrid);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Clean up the event listener and the ResizeObserver when the component unmounts
    return () => {
      window.removeEventListener("resize", calculateGrid);
      resizeObserver.disconnect();
    };
  }, []);

  return amount;
};

export default useGrid;
