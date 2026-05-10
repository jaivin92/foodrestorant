import { NavigationItem } from './navigation.models';

const allAuthenticatedRoles = ['super_admin', 'restaurant_admin', 'manager', 'waiter', 'kitchen', 'cashier', 'customer'] as const;
const adminRoles = ['super_admin', 'restaurant_admin', 'manager'] as const;
const floorRoles = ['super_admin', 'restaurant_admin', 'manager', 'waiter'] as const;
const orderRoles = ['super_admin', 'restaurant_admin', 'manager', 'waiter', 'kitchen', 'cashier'] as const;
const kitchenRoles = ['super_admin', 'restaurant_admin', 'manager', 'kitchen'] as const;
const cashierRoles = ['super_admin', 'restaurant_admin', 'manager', 'cashier'] as const;

export const drawerNavigationItems: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    description: 'Role-based overview and quick actions',
    roles: allAuthenticatedRoles,
  },
  {
    label: 'Admin Control',
    route: '/admin',
    description: 'Operations KPIs and management shortcuts',
    roles: adminRoles,
    badge: 'Admin',
  },
  {
    label: 'Table Status',
    route: '/table-status',
    description: 'Booked, pending, occupied, available, and cleaning tables',
    roles: floorRoles,
  },
  {
    label: 'Order Desk',
    route: '/order-desk',
    description: 'Create and manage table-wise orders',
    roles: orderRoles,
  },
  {
    label: 'Kitchen Queue',
    route: '/kitchen',
    description: 'Kitchen preparation queue by order and table',
    roles: kitchenRoles,
    badge: 'Kitchen',
  },
  {
    label: 'Cashier',
    route: '/cashier',
    description: 'Bills, payments, and settlement queue',
    roles: cashierRoles,
    badge: 'POS',
  },
  {
    label: 'Settings',
    route: '/settings',
    description: 'Basic user detail and password change',
    roles: allAuthenticatedRoles,
  },
  {
    label: 'Menu',
    route: '/menu',
    description: 'Menu',
    roles: allAuthenticatedRoles,
  },
];
