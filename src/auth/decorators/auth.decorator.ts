import { applyDecorators, UseGuards } from '@nestjs/common';
import { TypeRoles } from '../enums/rol.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { AuthGuard } from '../guard/auth.guard';

export function Auth(roles: TypeRoles) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard, RolesGuard));
}
