import { NavigationItem } from './navigation.models';

export const drawerNavigationItems: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    description: 'Role-based overview and quick actions',
    roles: ['admin', 'cook', 'staff', 'cashier', 'customer'],
  },
  {
    label: 'Admin Control',
    route: '/admin',
    description: 'Operations KPIs and management shortcuts',
    roles: ['admin'],
    badge: 'Admin',
  },
  {
    label: 'Table Status',
    route: '/table-status',
    description: 'Booked, pending, occupied, available, and cleaning tables',
    roles: ['admin', 'staff'],
  },
  {
    label: 'Order Desk',
    route: '/order-desk',
    description: 'Create and manage table-wise orders',
    roles: ['admin', 'staff', 'cook', 'cashier'],
  },
  {
    label: 'Kitchen Queue',
    route: '/kitchen',
    description: 'Cook/staff preparation queue by order and table',
    roles: ['admin', 'cook', 'staff'],
    badge: 'Cook',
  },
  {
    label: 'Cashier',
    route: '/cashier',
    description: 'Bills, payments, and settlement queue',
    roles: ['admin', 'cashier'],
    badge: 'POS',
  },

  {
    label: 'Settings',
    route: '/settings',
    description: 'Basic user detail and password change',
    roles: ['admin', 'cook', 'staff', 'cashier', 'customer'],
  },
];
