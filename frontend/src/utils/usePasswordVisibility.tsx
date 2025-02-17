// usePasswordVisibility.js
import { useSignal } from '@preact/signals-react';

const usePasswordVisibility = () => {
  const isPasswordVisible = useSignal(false);

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
  };

  return { isPasswordVisible, togglePasswordVisibility };
};

export default usePasswordVisibility;
