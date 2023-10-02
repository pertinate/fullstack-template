import './App.css';
import {
    RouterProvider,
    createBrowserRouter,
    useParams,
} from 'react-router-dom';
import { routingFactory } from '@local/types';
import { lazy } from 'react';

const Home = lazy(() => import('./pages/home'));

const ProductId = () => {
    const params = useParams();
    return <>{params.productId}</>;
};

const router = createBrowserRouter([
    ...routingFactory({
        '/': <Home />,
        '/about/me': <>test</>,
        '/about/product_number_one': <></>,
        '/products/:productId': <ProductId />,
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
