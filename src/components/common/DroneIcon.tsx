
import { forwardRef } from 'react';
import { LucideProps } from 'lucide-react';

export const Drone = forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        <path d="M12 22a9 9 0 0 1-9-9c0-4.97 8-11 9-11 1 0 9 6.03 9 11a9 9 0 0 1-9 9z" />
        <path d="M12 19a1 1 0 0 1-1-1c0-.28.45-.63.5-.63.53 0 1.5.35 1.5.63a1 1 0 0 1-1 1z" />
        <path d="M13 13c-2 1-3 3.5-3 5 0 0 1 1 2 1s2-1 2-1v-5" />
        <path d="M13 13c2 1 3 3.5 3 5 0 0-1 1-2 1s-2-1-2-1v-5" />
        <path d="M9.82 13H4a1 1 0 0 1-1-1c0-.28.45-.63.5-.63C7 12 11 7 11 7l1.5 3-2.68 3z" />
        <path d="M14.18 13H20a1 1 0 0 0 1-1c0-.28-.45-.63-.5-.63C17 12 13 7 13 7l-1.5 3 2.68 3z" />
      </svg>
    );
  }
);

Drone.displayName = 'Drone';

export default Drone;
