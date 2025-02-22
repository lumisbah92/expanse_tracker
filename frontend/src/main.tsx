import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import './main.css';
import { router } from './routes';

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

