import { SubmitHandler } from 'react-hook-form';
import usePasswordVisibility from '../../../../utils/usePasswordVisibility';
import { Eye, EyeSlash } from 'iconsax-react';
import FormRC from '../../../../Components/form/FormRC';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { isPasswordVisible: isNewPasswordVisible, togglePasswordVisibility: toggleNewPasswordVisibility } = usePasswordVisibility();
  const { isPasswordVisible: isConfirmPasswordVisible, togglePasswordVisibility: toggleConfirmPasswordVisibility } = usePasswordVisibility();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
    // Ensure newPassword and confirmPassword match
    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(null), 1000);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`${errorData.error || 'Failed to reset password'}`);
        setTimeout(() => setError(null), 1000);
      } else {
        setSuccess('Password reset successfully');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (err: any) {
      setError(`${err.message}`);
      setTimeout(() => setError(null), 1000);
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },
    {
      name: 'newPassword',
      label: 'New password',
      type: isNewPasswordVisible.value ? 'text' : 'password',
      placeholder: 'Enter new password',
      icon: isNewPasswordVisible.value ? Eye : EyeSlash,
      iconClick: toggleNewPasswordVisibility,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm new Password',
      type: isConfirmPasswordVisible.value ? 'text' : 'password',
      placeholder: 'Confirm new password',
      icon: isConfirmPasswordVisible.value ? Eye : EyeSlash,
      iconClick: toggleConfirmPasswordVisibility,
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold mb-4 leading-9 tracking-wide text-nps-black-1">
        Reset Password
      </h1>
      <FormRC fields={fields} onSubmit={onSubmit} submitLabel="Change Password" />
      <div className="mt-2">
        {error ? <span className="text-sm text-red-500">{error}</span> : ''}
        {success ? <span className="text-sm text-green-500">{success}</span> : ''}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between mt-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            autoComplete="off"
            className="text-blue-500 cursor-pointer focus:ring-blue-400 border-gray-300 rounded"
          />
          <span className="text-base font-normal leading-5 tracking-wide text-nps-black-1/80 ml-2 text-gray-600">
            Keep me logged in
          </span>
        </label>
      </div>
    </>
  );
};

export default ResetPassword;


