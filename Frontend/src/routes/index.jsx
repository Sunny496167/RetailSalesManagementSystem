import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import Error from '../pages/Error';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);

export default router;