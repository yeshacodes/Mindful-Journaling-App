import { RouterProvider } from 'react-router';
import { EntriesProvider } from '../lib/EntriesContext';
import { router } from './routes';

export default function App() {
  return (
    <EntriesProvider>
      <RouterProvider router={router} />
    </EntriesProvider>
  );
}
