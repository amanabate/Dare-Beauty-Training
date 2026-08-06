import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal | Dare Beauty Training Institute',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dashboard pages are full-screen; no wrapper padding needed
  return <>{children}</>;
}
