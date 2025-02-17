import { Link, useNavigate } from 'react-router-dom';
import usePasswordVisibility from '../../../../utils/usePasswordVisibility';
import { Eye, EyeSlash } from 'iconsax-react';
import FormRC from '../../../../Components/form/FormRC';

const SignUpView = () => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const navigate = useNavigate();

  // This function handles form submission
  const handleLoginClick = (data: any) => {
    console.log('Input Data:', data.email); // Log the form data to the console
    navigate('/auth-selection'); // Navigate after form submission
  };

  // Define the fields for the form
  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter your full name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },
    {
      name: 'password',
      label: 'Password',
      type: isPasswordVisible.value ? 'text' : 'password',
      placeholder: 'Enter your password',
      icon: isPasswordVisible.value ? Eye : EyeSlash,
      iconClick: togglePasswordVisibility,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <span className="text-[28px] font-semibold mb-4 leading-[36.4px] tracking-wide text-textColor">Sign Up</span>

      {/* Use FormRC to render the form */}
      <FormRC
        formClassName="text-left min-w-full"
        fields={fields}
        onSubmit={handleLoginClick} // Pass the submit handler to FormRC
        submitLabel="Sign Up"
      />

      <div className="flex space-x-1 items-center justify-center mt-4">
        <span className="text-[14px] font-normal leading-[20.23px] tracking-wide text-textColor">Have any account?</span>
        <Link
          to="/sign-in"
          className="text-[14px] font-bold leading-[20.23px] tracking-wide text-primaryColor underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpView;
