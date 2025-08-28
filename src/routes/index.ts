import express, { Request, Response } from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { transactionRoute } from '../app/modules/transaction/transaction.routes';
import { UserRoutes } from '../app/modules/user/user.route';
import { walletRoutes } from '../app/modules/wallets/wallets.routes';
import sendResponse from '../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

router.route('/status').get((req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Server is alive and kicking',
  });
});
const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
  {
    path: '/wallets',
    route: walletRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
