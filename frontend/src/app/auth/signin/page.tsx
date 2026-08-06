import { Suspense } from 'react';
import { SignInPage } from '@/components/auth/SignInPage';

export const metadata = {
  title: 'Sign In | Dare Beauty Institute',
};

export default function SignInRoute() {
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  );
}
