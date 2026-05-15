import { ROLES } from '../constants/roles';

export const getDefaultRoute = (role) => {
  switch (role) {
    case ROLES.CUSTOMER:
      return '/'; // Homepage is the default dashboard for customers
    case ROLES.WORKER:
      return '/worker';
    case ROLES.OFFICIAL:
      return '/dashboard';
    default:
      return '/';
  }
};
