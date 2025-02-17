import React, { useRef, useEffect, forwardRef } from 'react';
import cn from '../../utils/cn';
import { ArrowDown2 } from 'iconsax-react';
import { useSignal } from '@preact/signals-react';

interface ComboBoxProps {
  options?: { id: number | string; value: string }[];
  placeholder?: string;
  onSelect: (value: any) => void;
  inputClassName?: string;
  parentClassName?: string;
  labelClassName?: string;
  name?: string;
  label: string;
  dropdownClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  required?: boolean;
  value?: any;
  border?: string;
}

const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(
  (
    {
      options,
      name,
      label,
      placeholder = 'Search...',
      onSelect,
      inputClassName = '',
      parentClassName = '',
      dropdownClassName = '',
      optionClassName = '',
      labelClassName = '',
      disabled,
      required,
      value,
      border,
    },
    ref
  ) => {
    const searchValue = useSignal('');
    const filteredOptions = useSignal(options);
    const isDropdownOpen = useSignal(false);

    const comboBoxRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      searchValue.value = value;

      // Filter options based on search input
      const filtered = options?.filter((option) => option.value.toLowerCase().includes(value.toLowerCase()));
      filteredOptions.value = filtered;
      isDropdownOpen.value = filtered && filtered.length > 0 ? true : false;
    };

    const handleOptionSelect = (id: number | string, value: string) => {
      searchValue.value = value; // Update input with selected value
      onSelect({ id, value }); // Notify parent about selection
      isDropdownOpen.value = false; // Close dropdown
    };

    useEffect(() => {
      searchValue.value = value || ''; // Update searchValue whenever value changes
    }, [searchValue, value]);

    // Close dropdown when clicking outside of the ComboBox
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
          isDropdownOpen.value = false;
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);

    return (
      <div className={cn('relative w-full mt-4 mb-2', parentClassName)}>
        {/* Label for the input field */}
        <label
          className={cn('text-sm font-normal leading-5 tracking-wider text-textColor/80', labelClassName)}
          htmlFor={name}
        >
          {label}
        </label>

        <div ref={comboBoxRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              className={cn(
                'p-3 w-full border text-textColor text-sm font-normal border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 placeholder:text-sm placeholder:text-textColor/40',
                inputClassName,
                border,
                { 'opacity-50': disabled }
              )}
              placeholder={placeholder}
              value={searchValue.value}
              onChange={handleInputChange}
              disabled={disabled}
              onFocus={() => (isDropdownOpen.value = true)} // Open dropdown on focus
              required={required}
              ref={ref} // Forwarded ref
              autoComplete="off"
            />
            <ArrowDown2
              className="absolute right-3 text-textColor/60 cursor-pointer"
              onClick={() => (isDropdownOpen.value = !isDropdownOpen.value)} // Toggle dropdown visibility
              variant="Bold"
              size="16"
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen.value && (
            <ul
              className={cn(
                'absolute mt-1 max-h-40 overflow-auto bg-white border rounded w-full z-10',
                dropdownClassName
              )}
            >
              {filteredOptions.value && filteredOptions.value.length > 0 ? (
                filteredOptions.value.map((option) => (
                  <li
                    key={option.id}
                    className={cn(
                      `text-textColor text-sm font-normal cursor-pointer px-4 py-2 hover:bg-gray-100 ${optionClassName}`,
                      {
                        'bg-gray-200': searchValue.value === option.value, // Highlight the selected value
                      }
                    )}
                    onClick={() => handleOptionSelect(option.id, option.value)}
                  >
                    {option.value}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

ComboBox.displayName = 'ComboBox';

export default ComboBox;
