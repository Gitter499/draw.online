import { useEffect, useState } from "react";

const useWindowDimensions = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [dimensions, setDimension] = useState({ height, width });

  useEffect(() => {
    const handleResize = () => {
      setDimension({ height, width });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return dimensions;
};

export default useWindowDimensions;
