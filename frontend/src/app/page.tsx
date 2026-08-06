import { Suspense } from 'react';
import { HomeClient } from '@/components/landing/HomeClient';

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
