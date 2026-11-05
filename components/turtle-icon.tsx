import React from "react";

function TurtleIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <g fill="currentColor" stroke="none">
        <ellipse cx="12" cy="3.4" rx="1.9" ry="2.1" />
        <ellipse cx="5.8" cy="7.1" rx="2.1" ry="1.3" transform="rotate(-40 5.8 7.1)" />
        <ellipse cx="18.2" cy="7.1" rx="2.1" ry="1.3" transform="rotate(40 18.2 7.1)" />
        <ellipse cx="5.8" cy="18.9" rx="2.1" ry="1.3" transform="rotate(40 5.8 18.9)" />
        <ellipse cx="18.2" cy="18.9" rx="2.1" ry="1.3" transform="rotate(-40 18.2 18.9)" />
        <path d="M10.9 20.2h2.2L12 23Z" />
      </g>
      <ellipse cx="12" cy="13" rx="6.3" ry="7.5" />
      <path d="M12 10.4 14.3 11.7v2.6L12 15.6l-2.3-1.3v-2.6Z" />
      <path d="M12 10.4V5.5M12 15.6v4.9M14.3 11.7l3.5-2.1M9.7 11.7 6.2 9.6M14.3 14.3l3.5 2.1M9.7 14.3l-3.5 2.1" />
    </svg>
  );
}

export default TurtleIcon;
