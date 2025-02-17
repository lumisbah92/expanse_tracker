import { Link, useNavigate } from 'react-router-dom';
import usePasswordVisibility from '../../../../utils/usePasswordVisibility';
import { Eye, EyeSlash } from 'iconsax-react';
import FormRC from '../../../../Components/form/FormRC';

const SignInView = () => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const navigate = useNavigate();

  // This function handles form submission
  const handleLoginClick = (data: any) => {
    console.log('Input Data:', data.email); // Log the form data to the console
    navigate('/dashboard'); // Navigate after form submission
  };

  // Define the fields for the form
  const fields = [
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
    <>
      <span className="text-[28px] font-semibold mb-4 leading-[36.4px] tracking-wide text-[#2C3E50]">Sign In</span>

      {/* Use FormRC to render the form */}
      <FormRC
        fields={fields}
        onSubmit={handleLoginClick} // Pass the submit handler to FormRC
        submitLabel="Sign In"
      />

      {/* Remember Me and Forgot Password Section */}
      <div className="flex space-x-2 items-center justify-between mt-4">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" autoComplete="off" className="text-blue-500 cursor-pointer focus:ring-blue-400 border-gray-300 rounded" />
          <span className="text-base font-normal leading-5 tracking-wide text-textColor/80 ml-2 text-gray-600">
            Remember me
          </span>
        </label>
        <Link
          to="/reset-password-method"
          className="text-sm font-normal leading-5 tracking-wide text-textColor hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="flex space-x-1 items-center justify-center mt-4">
        <span className="text-[14px] font-normal leading-[20.23px] tracking-wide text-[#2C3E50]">Don’t have an account?</span>
        <Link
          to="/sign-up"
          className="text-[14px] font-bold leading-[20.23px] tracking-wide text-[#3498DB] underline"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInView;
