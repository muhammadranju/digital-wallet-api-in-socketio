import express from 'express';
import { TransactionController } from './transaction.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import {
  createTransactionZodSchema,
  sendMoneyZodSchema,
} from './transaction.validation';

const router = express.Router();

router
  .route('/add-money')
  .post(
    auth(USER_ROLES.AGENT, USER_ROLES.USER),
    TransactionController.addMoney
  );

router
  .route('/withdraw')
  .post(
    auth(USER_ROLES.AGENT, USER_ROLES.USER),
    TransactionController.withdrawMoney
  );
router
  .route('/send-money')
  .post(
    auth(USER_ROLES.AGENT, USER_ROLES.USER),
    validateRequest(sendMoneyZodSchema),
    TransactionController.sendMoney
  );
router.route('/me').get(
  auth(USER_ROLES.AGENT, USER_ROLES.USER),

  TransactionController.getMyTransaction
);
router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), TransactionController.getAllUserTransactions);

router
  .route('/cash-in')
  .post(
    auth(USER_ROLES.AGENT),
    validateRequest(createTransactionZodSchema),
    TransactionController.cashInTransactions
  );
router
  .route('/cash-out')
  .post(
    auth(USER_ROLES.AGENT),
    validateRequest(createTransactionZodSchema),
    TransactionController.cashOutTransactions
  );

export const transactionRoute = router;
