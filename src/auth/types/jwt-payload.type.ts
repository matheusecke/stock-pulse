export type JwtPayload = {
  sub: number;
  identifier: string;
};

export type JwtRefreshPayload = JwtPayload & {
  refreshToken: string;
};
