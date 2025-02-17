import React, { forwardRef } from 'react';
import cn from '../../utils/cn';

export const InputField = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    type: any;
    name: string;
    value?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    icon?: React.ElementType;
    iconClick?: () => void;
    labelClassName?: string;
    inputClassName?: string;
    parentClassName?: string;
    chat?: boolean;
  }
>(
  (
    {
      label,
      type,
      name,
      value,
      onChange,
      placeholder,
      disabled,
      required,
      labelClassName,
      inputClassName,
      parentClassName,
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full mt-4 mb-4 font-inter', parentClassName)}>
        {/* Label for the input field */}
        <div>
          {
            label &&(
              <label
                className={cn('font-normal leading-5 tracking-wide text-datahead-black-1 mb-1 text-base', labelClassName)}
                htmlFor={name}
              >
                {label}
              </label>
            )
          }
          
        </div>
        {/* Input field */}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          disabled={disabled}
          className={cn(
            'w-full placeholder:text-datahead-black-1/40 text-datahead-black text-sm font-normal px-3 py-3 border border-datahead-black-4 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-datahead-primary focus:border-2 placeholder:text-sm',
            inputClassName,
            { 'opacity-50': disabled }
          )}
        />
       
      </div>
    );
  }
);

InputField.displayName = 'InputField'; // Helpful for debugging with React DevTools
export default InputField;
