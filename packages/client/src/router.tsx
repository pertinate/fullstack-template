import './App.css';
import {
    BrowserRouter,
    Route,
    RouteObject,
    RouterProvider,
    Routes,
    createBrowserRouter,
} from 'react-router-dom';
import Home from './pages/home';
import { routingFactory } from '@types';

const Test = () => {
    console.log('lel');
    return <>testttt</>;
};

const router = createBrowserRouter(
    routingFactory({
        '/': <Home />,
        '/about/me': <>test</>,
        '/about/product_number_one': <></>,
    }),
);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
