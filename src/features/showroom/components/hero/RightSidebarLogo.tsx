import React from 'react';

type RightSidebarLogoProps = {
  className?: string;
};

export default function RightSidebarLogo({ className = '' }: RightSidebarLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo3.png" alt="VALS 360" className="logo-img" />
    </div>
  );
}
