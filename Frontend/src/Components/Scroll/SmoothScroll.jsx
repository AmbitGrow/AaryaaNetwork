import "./SmoothScroll.css"; // you will create this for smoothness
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const SmoothScroll = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      multiplier: 1,
      lerp: 0.08,
    });

    return () => {
      scrollRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.update();
    scrollRef.current?.scrollTo(0, { duration: 0, disableLerp: true });
  }, [location]);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
};

export default SmoothScroll;
