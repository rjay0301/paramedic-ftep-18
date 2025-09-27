
import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className,
  bgColor = 'bg-primary-50',
  textColor = 'text-primary-800'
}) => {
  return (
    <div className={`px-6 py-4 ${bgColor} ${className || ''}`}>
      <h1 className={`text-xl md:text-2xl font-semibold ${textColor}`}>{title}</h1>
      {subtitle && <p className="text-sm md:text-base mt-1 text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
