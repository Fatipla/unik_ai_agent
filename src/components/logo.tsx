import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
        <path d="M108,100a12,12,0,1,1-12-12A12,12,0,0,1,108,100Z" />
        <path d="M160,100a12,12,0,1,1-12-12A12,12,0,0,1,160,100Z" />
        <path d="M168,140H88a12,12,0,0,0,0,24h80a12,12,0,0,0,0-24Z" />
      </g>
    </svg>
  );
}
