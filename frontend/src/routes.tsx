import { createBrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';

export const router = createBrowserRouter([Routes], {basename: "/"});
