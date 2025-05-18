import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Toaster } from 'sonner';
import { SignOutButton } from './pages/auth/signout-button';
import { SignInForm } from './pages/auth/signin-form';
import { AdminDashboard } from './pages/admin/admin-dashboard';
import { OfficialDashboard } from './pages/official/official-dashboard';
import { ComplaintForm } from './pages/complaints/complaint-form';
import { ComplaintList } from './pages/complaints/complaint-list';
import { MegaphoneIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';

export default function App() {
  const isOfficial = useQuery(api.complaints.isOfficial) ?? false;
  const isAdmin = useQuery(api.admin.isAdmin) ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-indigo-600">
            Citizen Engagement Portal
          </h2>
        </div>
        <SignOutButton />
      </header>
      <main className="flex-1 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Content isOfficial={isOfficial} isAdmin={isAdmin} />
        </div>
      </main>
      <footer className="bg-slate-900 text-slate-300 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <MegaphoneIcon className="h-4 w-4" /> Citizen Engagement Portal
            </h3>
            <p className="text-sm">
              Empowering citizens to improve communities
            </p>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}

function Content({
  isOfficial,
  isAdmin,
}: {
  isOfficial: boolean;
  isAdmin: boolean;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600"></div>
          <p className="text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <div className="inline-flex justify-center items-center mb-6">
          {isAdmin ? (
            <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
              <LayoutDashboardIcon size={32} />
            </div>
          ) : isOfficial ? (
            <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
              <UserIcon size={32} />
            </div>
          ) : (
            <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
              <MegaphoneIcon size={32} />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {isAdmin
            ? 'Admin Dashboard'
            : isOfficial
              ? 'Official Dashboard'
              : 'Citizen Engagement System'}
        </h1>

        <Authenticated>
          <p className="text-xl text-slate-600 mb-2">
            Welcome, {loggedInUser?.email ?? 'user'}!
          </p>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
        </Authenticated>

        <Unauthenticated>
          <p className="text-xl text-slate-600 mb-2">Sign in to continue</p>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto w-full">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        {isAdmin ? (
          <AdminDashboard />
        ) : isOfficial ? (
          <OfficialDashboard />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <ComplaintForm />
            </div>
            <div className="lg:col-span-7">
              <ComplaintList />
            </div>
          </div>
        )}
      </Authenticated>
    </div>
  );
}
