import { createBrowserRouter } from 'react-router-dom';
import LoginRoutes from './routes/LoginRoutes';

export const router = createBrowserRouter([LoginRoutes], {basename: "/"});
