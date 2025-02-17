import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Button from '../buttons/ButtonRC';
import cn from '../../utils/cn';
import ComboBox from '../textField/ComboBox';

interface FormFieldProps {
  name: string;
  required?: boolean;
  label: string;
  inputType?: string;
  type?: string; // Optional: For different input types (e.g., text, number, password)
  placeholder?: string;
  options?: { id: number | string; value: string }[];
  icon?: React.ElementType; // Optional: The icon component
  iconClick?: () => void; // Optional: The function to execute when the icon is clicked
}

interface FormProps {
  fields: FormFieldProps[]; // Array of form fields to dynamically render
  onSubmit: SubmitHandler<Record<string, any>>;
  submitLabel?: string;
  gridClassName?: string;
  inputClassName?: string;
  buttonWidth?: string;
  cancel?: boolean;
  title?: string;
  background?: string;
  formClassName?: string
}

const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  return <span className="text-sm text-red-500 mt-1 mb-1">{error || '\u00A0'}</span>;
};

const FormRC: React.FC<FormProps> = ({
  background,
  fields,
  title,
  cancel,
  onSubmit,
  submitLabel,
  buttonWidth,
  gridClassName,
  inputClassName,
  formClassName
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Record<string, any>>(); // Generic type for dynamic fields

  return (
    <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(background)}>
        <h1 className="mb-4 text-primaryColor text-base">{title}</h1>
        <div className={cn(`grid`, gridClassName)}>
          {fields.map((field) =>
            field.inputType === 'combobox' ? (
              <div key={field.name} className="flex justify-center flex-col relative">
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: `${field.label} is required` }}
                  render={({ field: { onChange, value } }) => {
                    // Find the current option's value based on its ID
                    const selectedOption = field.options?.find((option) => option.id === value);

                    return (
                      <ComboBox
                        options={field.options || []}
                        label={field.label}
                        placeholder={field.placeholder}
                        onSelect={(option) => onChange(option.id)} // Pass only the ID to the form state
                        value={selectedOption?.value || ''} // Display the corresponding value in the ComboBox
                        border="border-textColor"
                        inputClassName={inputClassName}
                        parentClassName="mt-0"
                      />
                    );
                  }}
                />
                <FieldError error={errors[field.name]?.message?.toString()} />
              </div>
            ) : field.type === "freeText" ? (
              <div key={field.name} className="flex justify-start items-start flex-col relative">
                <label
                  htmlFor={field.name}
                  className={"font-normal leading-5 tracking-wide text-textColor/80 mb-1"}
                >
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  {...register(field.name, { required: `${field.label} is required` })}
                  placeholder={field.placeholder || ''}
                  className={cn(
                    `w-full resize-none placeholder:text-textColor/40 text-textColor text-sm font-normal px-3 py-3 border border-textColor rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 placeholder:text-sm ${inputClassName}`
                  )}
                  rows={4} // Adjust the number of rows as needed
                  autoComplete="off"
                ></textarea>

                <FieldError error={errors[field.name]?.message?.toString()} />
              </div>
            )
              : (
                <div key={field.name} className="flex justify-center flex-col relative">
                  <label
                    htmlFor={field.name}
                    className={cn(
                      `font-normal leading-5 tracking-wide text-textColor/80 mb-1`,
                      submitLabel === 'Create Contact' ? 'text-sm' : 'text-base'
                    )}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    {...register(field.name, { required: `${field.label} is required` })}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    className={cn(
                      `w-full placeholder:text-textColor/40 text-textColor text-sm font-normal px-3 py-3 border border-textColor rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 placeholder:text-sm ${inputClassName}`
                    )}
                    autoComplete="off"
                  />
                  <FieldError error={errors[field.name]?.message?.toString()} />
                </div>
              )
          )}
        </div>
      </div>
      <div className={cn(`mt-2`, buttonWidth)}>
        <Button
          size={submitLabel === 'Create Contact' ? 'xs' : 'md'}
          bgColor="bg-primaryColor"
          className={cn(submitLabel !== 'Create Contact' && 'w-full')}
          textColor="text-white"
          type="submit"
          hoverColor="hover:bg-primaryColor/90"
        >
          {submitLabel}
        </Button>

        {cancel && (
          <Button
            size="sm"
            hoverColor="hover:bg-red-400"
            hoverTextColor="hover:text-white"
            textColor="text-red-600"
            bgColor="bg-red-200"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormRC;
