import { SetMetadata } from '@nestjs/common';

import { roles } from '../../utils/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: roles[]) => SetMetadata(ROLES_KEY, roles);
