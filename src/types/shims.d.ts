declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "recharts/*";
declare module "react-day-picker" {
  export * from "react-day-picker";
}
