import Image from "next/image";

type IconProps = { name: string; width: number, height: number };

export const SVGIcon: React.FC<IconProps> = ({ name, width, height }) => (
  <div style={{ width: `${width}px`, height: `${height}px` }} className="flex items-center justify-center cursor-pointer">
    <Image src={`/${name}.svg`} alt={name} width={width} height={height} />
  </div>
);
