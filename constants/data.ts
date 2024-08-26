import { NavItem } from '@/types';

export type Project = {
  id: number;
  name: string;
  description: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: 'Code',
    label: 'projects'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Logout',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
