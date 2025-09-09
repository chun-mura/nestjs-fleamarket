import { UserStatus } from '../../generated/prisma/client';

export type JwsPayload = {
  sub: string;
  username: string;
  status: UserStatus;
};
