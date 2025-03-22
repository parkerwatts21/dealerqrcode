"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
      style={{ 
        gap: "1rem",
      }}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around",
              {
                "animate-marquee": !vertical,
                "animate-marquee-vertical": vertical,
                "[animation-direction:reverse]": reverse,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
              }
            )}
            style={{ gap: "1rem" }}
          >
            {children}
          </div>
        ))}
    </div>
  );
} 