import { Suspense } from 'react';
import { SignUpPage } from '@/components/auth/SignUpPage';

export const metadata = {
  title: 'Create Account | Dare Beauty Institute',
};

export default function SignUpRoute() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
