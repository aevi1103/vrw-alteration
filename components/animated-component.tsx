import React, { useState, useEffect, ReactNode } from "react";
import "animate.css/animate.min.css";

interface AnimatedComponentProps {
  children: ReactNode;
  animatedName: string; // Define the animatedName prop
}

export const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  children,
  animatedName,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Adjust the threshold as needed
      }
    );

    const target = document.querySelector(".animate-me"); // Replace with a valid selector for your component

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  return (
    <div
      className={`animate__animated ${
        isVisible ? `animate__${animatedName}` : ""
      } animate-me`}
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;
