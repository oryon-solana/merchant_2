import { useState, useEffect } from "react";

export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const updatePosition = (event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updatePosition);
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);
  return position;
}
