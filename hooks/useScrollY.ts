import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
import { useState } from "react";

export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  const onWindowScroll = useWindowScroll();
  onWindowScroll((event) => {
    if (typeof window !== "undefined") {
      const scroll = window.scrollY;
      setScrollY(scroll);
      localStorage.setItem("scrollY", scroll.toString());
    }
  });

  return {
    scrollY,
  };
};
