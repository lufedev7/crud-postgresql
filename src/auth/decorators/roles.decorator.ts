import { SetMetadata } from '@nestjs/common';
import { TypeRoles } from '../../common/enums/rol.enum';
export const ROLES_KEY = 'roles';
export const Roles = (role: TypeRoles) => SetMetadata(ROLES_KEY, role);
