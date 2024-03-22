import { RouteObject } from 'react-router';
import HomePage from '../pages/Home';
import Follow from '../pages/Follow';
import Address from '../pages/Address';
import Track from '../pages/Track';
import Trend from '../pages/Trend';
import TrackDetail from '../pages/Details/TrackDetail';
import { AddressDetails } from '../pages/Details/AddressDetails';
import { RequireAuth } from '../Auth/RequireAuth';
import AddressTag from '../pages/addressTag';
import ResetPassword from "../pages/sso/ResetPassword";
import { Login } from '../pages/User/Login';

const routes: RouteObject[] = [
    {
        path: '/login',
        element: (
            <Login />
        )
    },
    {
        path: '/',
        element: (
            <RequireAuth>
                <HomePage />
            </RequireAuth>
        ),
    },
    {
        path: 'home',
        element: (
            <RequireAuth>
                <HomePage />
            </RequireAuth>
        ),
    },
    {
        path: 'follow',
        element: (
            <RequireAuth>
                <Follow />
            </RequireAuth>
        ),
    },

    {
        path: '/:wallet/:address',
        element: (
            <RequireAuth>
                <AddressDetails />
            </RequireAuth>
        ),
    },
    {
        path: 'address',
        element: (
            <RequireAuth>
                <Address />
            </RequireAuth>
        ),
    },
    {
        path: 'track',
        element: (
            <RequireAuth>
                <Track />
            </RequireAuth>
        ),
    },
    // 追踪任务详情
    {
        path: 'TrackDetail/:wallet/:address',
        element: (
            <RequireAuth>
                <TrackDetail />
            </RequireAuth>
        ),
    },
    {
        path: 'trend',
        element: (
            <RequireAuth>
                <Trend />
            </RequireAuth>
        ),
    },
    {
        path: 'trend/:address',
        element: (
            <RequireAuth>
                <Trend />
            </RequireAuth>
        ),
    },
    {
        path: 'addressTag',
        element: (
            <RequireAuth>
                <AddressTag />
            </RequireAuth>
        ),
    },
    {
        path: 'reset-password/step2',
        element: (
            <RequireAuth>
                <ResetPassword />
            </RequireAuth>
        ),
    },
];

export default routes;
