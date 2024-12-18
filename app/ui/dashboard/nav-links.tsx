'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Sandbox Tools', href: '/dashboard', icon: WrenchIcon },
  { name: 'Hosted Assets', href: '/assets', icon: CodeBracketIcon },
  {
    name: 'Payment Flows',
    href: '/dashboard/invoices/create',
    icon: MapIcon,
  },
  { name: 'Order Management', href: '/dashboard/invoices', icon: CurrencyDollarIcon },
  { name: 'Test Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-[#F3F4F6]': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
