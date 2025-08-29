import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: number;
  identifier: string;
  role: Role;
};

export type JwtRefreshPayload = JwtPayload & {
  refreshToken: string;
};
