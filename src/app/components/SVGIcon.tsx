import Image from "next/image";

type IconProps = { name: string; size: number };

export const SVGIcon: React.FC<IconProps> = ({ name, size }) => (
  <div style={{ width: `${size}px`, height: `${size}px` }} className="flex items-center justify-center">
    <Image src={`/${name}.svg`} alt={name} width={size} height={size} />
  </div>
);
