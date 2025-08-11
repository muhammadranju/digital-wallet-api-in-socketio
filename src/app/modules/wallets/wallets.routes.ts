import express from 'express';
import { UserController } from './wallets.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.route('/').get(auth(USER_ROLES.ADMIN), UserController.getAllWallets);
router
  .route('/me')
  .get(auth(USER_ROLES.USER, USER_ROLES.AGENT), UserController.getMyWallet);
router
  .route('/block/:id')
  .patch(auth(USER_ROLES.ADMIN), UserController.blockUser);
router
  .route('/unblock/:id')
  .patch(auth(USER_ROLES.ADMIN), UserController.unBlockUser);

export const walletRoutes = router;
