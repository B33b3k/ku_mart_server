import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { ISession } from "./ISession";

export type GraphQLContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { data: ISession };
    ip: string;
    headers: Record<string, string>;
  };
  res: Response;
  redis: Redis;
};
