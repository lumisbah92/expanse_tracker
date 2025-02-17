import React, { useEffect, useState } from 'react';
import './RippleDivRC.css';

interface RippleDivRCProps {
  children?: React.ReactNode;
  className?: string;
}

const RippleDivRC = ({ children, className }: RippleDivRCProps) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [rippleActive, setRippleActive] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) setRippleActive(true);
    else setRippleActive(false);
  }, [coords]);

  useEffect(() => {
    if (rippleActive) setTimeout(() => setRippleActive(false), 1000);
    else setCoords({ x: -1, y: -1 });
  }, [rippleActive]);

  return (
    <div
      tabIndex={0} // Add tabIndex attribute to make the div focusable
      className={`ripple-div ${className ?? ''}`}
      onClick={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        // e.stopPropagation(); // Prevent the click event from affecting other elements
      }}
    >
      {rippleActive ? (
        <span className="ripple-span w-0" style={{ left: coords.x, top: coords.y } as React.CSSProperties} />
      ) : null}
      {children}
    </div>
  );
};

export default RippleDivRC;
