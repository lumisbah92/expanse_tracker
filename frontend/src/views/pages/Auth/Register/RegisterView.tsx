import { Link, useNavigate } from 'react-router-dom';
import usePasswordVisibility from '../../../../utils/usePasswordVisibility';
import { Eye, EyeSlash } from 'iconsax-react';
import FormRC from '../../../../Components/form/FormRC';
import axios from 'axios';

const SignUpView = () => {
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const navigate = useNavigate();

  const handleRegisterClick = async (data: any) => {
    try {
      console.log('Input Data:', data);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/auth/register`, data);
      console.log('Response:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      <span className="text-[28px] font-semibold mb-4 leading-[36.4px] tracking-wide text-textColor">Register</span>

      <FormRC
        formClassName="text-left min-w-full"
        fields={fields}
        onSubmit={handleRegisterClick}
        submitLabel="Register"
      />

      <div className="flex space-x-1 items-center justify-center mt-4">
        <span className="text-[14px] font-normal leading-[20.23px] tracking-wide text-textColor">Have any account?</span>
        <Link
          to="/login"
          className="text-[14px] font-bold leading-[20.23px] tracking-wide text-primaryColor underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpView;

