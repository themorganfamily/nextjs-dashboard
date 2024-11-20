import SideNav from '@/app/ui/dashboard/sidenav';
export const experimental_ppr = true;
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Integration Tools',
    default: 'Integration Tools',
  },
  description: 'The official Zip Integration Tools.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function Layout({ children, modal }: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}