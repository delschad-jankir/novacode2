// sidebar.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardNav } from '../dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';

type SidebarProps = {
  className?: string;
};

const baseProjectNavItems = [
  {
    title: 'Back to Projects',
    href: '/projects',
    icon: "ArrowLeft",
    label: 'Back to Projects'
  },
  {
    title: 'General Information',
    slug: 'general',
    icon: "BadgeInfo",
    label: 'General Information'
  },
  {
    title: 'Code Structure',
    slug: 'code-structure',
    icon: "Code",
    label: 'Code Structure'
  },
  {
    title: 'Components and Modules',
    slug: 'components',
    icon: "Box",
    label: 'Components and Modules'
  },
  {
    title: 'Build and Dev Process',
    slug: 'build-process',
    icon: "Wrench",
    label: 'Build and Dev Process'
  },
  {
    title: 'Code Explorer',
    slug: 'code-explorer',
    icon: "Sparkle",
    label: 'Code Explorer'
  },
  {
    title: 'Q&A',
    slug: 'qa',
    icon: "HelpCircle",
    label: 'Q&A'
  }
];

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const pathname = usePathname() || ''; // Ensure pathname is defined

  // Determine if we're on a project page and not on the "/projects/new" page
  const isProjectPage = pathname.startsWith('/projects/') && pathname !== '/projects/new';
  
  // Extract project ID from the pathname
  const projectId = isProjectPage ? pathname.split('/')[2] : '';

  const handleToggle = () => {
    toggle();
  };

  // Generate project-specific navigation items
  const projectNavItems = baseProjectNavItems.map(item => ({
    ...item,
    href: item.slug ? `/projects/${projectId}/${item.slug}` : item.href
  }));

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={'https://github.com/Kiranism/next-shadcn-dashboard-starter'}
          target="_blank"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            {!isMinimized && <span className="text-xl font-bold">NovaCode</span>}
          </div>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={pathname === '/projects/new' ? navItems : (isProjectPage ? projectNavItems : navItems)} />
          </div>
        </div>
      </div>
    </aside>
  );
}
