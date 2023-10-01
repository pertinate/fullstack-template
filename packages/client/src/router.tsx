import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import { routingFactory } from '@local/types';

const router = createBrowserRouter([
    ...routingFactory({
        '/': <Home />,
        '/about/me': <>test</>,
        '/about/product_number_one': <></>,
    }),
    {
        path: '/test',
        element: <>hello world</>,
    },
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
