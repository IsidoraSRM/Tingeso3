import { useState, useEffect } from "react";
import './Pista.css';
const Animation = () => {
  const totalFrames = 10;
  const [frame, setFrame] = useState(1);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev < totalFrames ? prev + 1 : 1));
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
  src={`/animation/Imagen${frame}.png`}
  alt={`Frame ${frame}`}
  width={570}
  height={600}
  style={{
    filter: "drop-shadow(0 0 20px #303030)",
    filter: hover ? "drop-shadow(0 0 20px #A3320A)" : "drop-shadow(0 0 20px #303030)",
    transition: "filter 0.3s",
    animation: hover ? "vibrate 0.3s infinite linear" : "none", // vibrar con hover
    cursor: "pointer"
  }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
/>
  );
};

export default Animation;