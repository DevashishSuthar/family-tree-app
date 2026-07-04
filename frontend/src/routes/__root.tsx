import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Loader } from '../components/Loader';
import { Header } from '../components/Header';
import { NotFound } from '../components/NotFound';

const RootLayout = () => {
  return (
    <Loader>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <Outlet />
      </div>
    </Loader>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});