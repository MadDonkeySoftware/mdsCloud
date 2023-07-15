import { FastifyInstance, FastifyRequest } from 'fastify';
import { sign } from 'jsonwebtoken';
import { validateToken } from '../../hooks';
import { getRepo } from '../../repo';
import {
  ImpersonateRequestBody,
  ImpersonateRequestBodySchema,
  ImpersonateResponseBodySchema,
} from '../../schemas';
import { MdsIdentityJwtPayload } from '../../types';
import { delay, getJwtSigningData } from '../../utils';

function getRequestId(request: FastifyRequest): string {
  return (request.parsedToken?.payload as MdsIdentityJwtPayload).accountId;
}

export async function impersonationController(
  app: FastifyInstance,
): Promise<void> {
  app.addHook('onRequest', validateToken(app));

  app.post<{
    Body: ImpersonateRequestBody;
  }>(
    '/impersonate',
    {
      schema: {
        body: ImpersonateRequestBodySchema,
        response: {
          200: ImpersonateResponseBodySchema,
        },
      },
    },
    async function handleImpersonate(request, response) {
      // TODO: Update impersonation to use surrogate account rather than root account
      const errorMessage =
        'Could not find account, user or insufficient privilege to impersonate';
      if (getRequestId(request) !== '1') {
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      const { body } = request;
      const { accountId, userId } = body;

      const repo = getRepo();
      const account = await repo.getAccountById(accountId);

      if (!account) {
        app.log.debug({ accountId }, 'No such account found');
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      if (!account.isActive) {
        app.log.debug({ accountId }, 'Account not active');
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      // TODO: When supporting impersonating users on the same account use this logic
      // const rootUserId = getRequestId(request) === '1' ? account.ownerId : undefined;
      const rootUserId = account.ownerId;

      const userIdToSearchFor = userId || rootUserId;
      if (userIdToSearchFor === undefined) {
        app.log.debug(
          'userIdToSearchFor is undefined. Cannot locate user for impersonation request.',
        );
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      const user = await repo.getUserById(userIdToSearchFor);
      if (!user) {
        app.log.debug({ userId }, 'No such user found');
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      if (!user.isActive) {
        app.log.debug({ userId }, 'User not active');
        await delay(10000);
        response.status(400);
        response.send({ message: errorMessage });
        return;
      }

      const jwtObject = {
        impersonatedBy: (request.parsedToken?.payload as MdsIdentityJwtPayload)
          .userId,
        accountId: account.accountId,
        userId: user.userId,
        friendlyName: user.friendlyName,
      };

      const { signingKey, signingOptions } = await getJwtSigningData();

      let token;
      try {
        token = sign(jwtObject, signingKey, signingOptions);
      } catch (err) {
        app.log.error({ err }, 'Could not generate user token.');
        response.status(400);
        response.send();
        return;
      }

      response.status(200);
      response.send({ token });
      return;
    },
  );
}
