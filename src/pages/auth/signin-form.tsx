/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {flow === 'signIn' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {flow === 'signIn'
            ? 'Enter your credentials to access your account'
            : 'Fill out the form to create a new account'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set('flow', flow);
          void signIn('password', formData).catch((error: any) => {
            const toastTitle =
              flow === 'signIn'
                ? 'Could not sign in, did you mean to sign up?'
                : 'Could not sign up, did you mean to sign in?';
            toast.error(`${toastTitle} ${error.message}`);
            setSubmitting(false);
          });
        }}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <MailIcon className="h-5 w-5" />
            </div>
            <input
              className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <LockIcon className="h-5 w-5" />
            </div>
            <input
              className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          className="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          type="submit"
          disabled={submitting}>
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 border-white rounded-full"></div>
              {flow === 'signIn' ? 'Signing in...' : 'Signing up...'}
            </div>
          ) : flow === 'signIn' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </button>

        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">
            {flow === 'signIn'
              ? "Don't have an account? "
              : 'Already have an account? '}
          </span>
          <button
            type="button"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}>
            {flow === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="h-px bg-border flex-1"></div>
        <span className="px-4 text-sm text-muted-foreground">
          or continue with
        </span>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <button
        className="w-full flex items-center justify-center py-2.5 px-4 bg-muted/50 hover:bg-muted text-foreground font-medium rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        onClick={() => void signIn('anonymous')}>
        <UserIcon className="h-5 w-5 mr-2" />
        Sign in anonymously
      </button>
    </div>
  );
}
