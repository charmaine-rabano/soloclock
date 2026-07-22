import { ICONS, type IconName } from "./registry";

export type { IconName };
export { iconNames } from "./registry";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  title?: string;
}

export function Icon({
  name,
  size = 16,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.8,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={stroke}
      fill={fill}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      aria-label={title}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
}
