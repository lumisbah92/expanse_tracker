import React from 'react';
import cn from '../../utils/cn';

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xs' | 'xl'; // Sizes for button
  variant?: 'submit' | 'iconBtn'; // Variant for button
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean; // Disable state
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Click handler
  className?: string; // Additional custom class
  children: React.ReactNode; // Content inside the button
  bgColor?: string;
  hoverColor?: string;
  textColor?: string;
  hoverTextColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
  bgColor,
  hoverColor,
  textColor,
  hoverTextColor,
  variant,
}) => {
  // Size-based styles
  const sizeStyles = {
    sm: 'px-2 py-2 text-sm font-normal',
    md: 'px-4 py-4 text-base font-medium',
    xs: 'px-4 py-2 text-base font-medium',
    lg: 'px-6 py-3 text-lg font-bold',
    xl: 'px-3 py-3 text-sm font-normal',
  };
  const btnName = {
    submit:
      'bg-datahead-primary hover:bg-bg-datahead-primary/90 text-datahead-black-1 w-full shadow transform hover:-translate-y-1 transition-transform duration-200  leading-[23.12px] tracking-[0.015em]',
    iconBtn: 'flex items-center mr-3 text-gray-600 hover:text-gray-700 border-[0.5px] p-2',
  };

  const combinedStyles = cn(
    'inline-flex items-center justify-center rounded-md transition duration-150',
    sizeStyles[size],
    disabled ? 'bg-gray-100 text-gray-500 hover:bg-gray-100' : '',
    `${bgColor}`, // Static class for background color
    `${hoverColor}`, // Static class for hover background
    `${textColor}`, // Static class for text color
    `${hoverTextColor}`, // Hover text color
    className,
    variant && btnName[variant]
  );
  return (
    <button onClick={onClick} disabled={disabled} className={combinedStyles} type={type}>
      {children}
    </button>
  );
};

export default Button;
