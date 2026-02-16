import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Home } from './pages/Home';
import { NewEntry } from './pages/NewEntry';
import { Entries } from './pages/Entries';
import { EntryDetail } from './pages/EntryDetail';
import { EditEntry } from './pages/EditEntry';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot',
    element: <ForgotPassword />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/entry/new',
    element: <NewEntry />,
  },
  {
    path: '/entries',
    element: <Entries />,
  },
  {
    path: '/entries/:id',
    element: <EntryDetail />,
  },
  {
    path: '/entries/:id/edit',
    element: <EditEntry />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]);
