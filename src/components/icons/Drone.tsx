
import React from 'react';

export const Drone = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9l-2-2h4L12 9z" />
      <path d="M12 15l-2 2h4L12 15z" />
      <path d="M9 12l-2-2v4L9 12z" />
      <path d="M15 12l2-2v4L15 12z" />
      <path d="M5 5l2 2M19 19l-2-2M19 5l-2 2M5 19l2-2" />
    </svg>
  );
};

export default Drone;
