import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const iconUrl = `/assets/${name}.svg`;
  const style: React.CSSProperties = {
    maskImage: `url(${iconUrl})`,
    WebkitMaskImage: `url(${iconUrl})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    backgroundColor: 'currentColor',
  };

  return <div className={className} style={style} {...props} />;
};

export default Icon;