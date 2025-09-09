import { UserStatus } from '../../generated/prisma/client';

export type RequestUser = {
  id: string;
  username: string;
  status: UserStatus;
};
