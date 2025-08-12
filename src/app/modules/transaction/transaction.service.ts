import { Request } from 'express';
import ApiError from '../../../errors/ApiError';
import { sendDataToUser } from '../../../helpers/socketManager';
import { User } from '../user/user.model';
import { Wallet } from '../wallets/wallets.model';
import {
  InitiatedBy,
  ITransaction,
  PayStatus,
  PayType,
} from './transaction.interface';
import { Transaction } from './transaction.model';

const addMoneyToDB = async (payload: ITransaction, req: Request) => {
  const userWallet = await Wallet.findOne({ user: req.user.id });

  if (!userWallet || userWallet.isBlocked) {
    throw new ApiError(400, 'You can not add money');
  }

  if (payload.amount === undefined) {
    throw new ApiError(400, 'Amount is required');
  }

  const amount =
    typeof payload.amount === 'string'
      ? parseInt(payload.amount)
      : payload.amount;

  userWallet.balance += amount;

  const transactions = await Transaction.create({
    type: PayType.ADD_MONEY,
    amount: payload.amount,
    wallet: userWallet.id,
    initiatedBy: InitiatedBy.USER,
    status: PayStatus.COMPLETED,
  });

  sendDataToUser(req.user.id, 'add-money-notify', transactions);

  await userWallet.save();

  return transactions;
};

const withdrawMoneyToDB = async (payload: ITransaction, req: Request) => {
  const userWallet = await Wallet.findOne({ user: req.user.id });

  if (!userWallet || userWallet.isBlocked) {
    throw new ApiError(400, 'You can not withdraw money');
  }

  if (userWallet.balance < payload.amount) {
    throw new ApiError(400, 'You don`t have efficient balance ');
  }

  const amount =
    typeof payload.amount === 'string'
      ? parseInt(payload.amount)
      : payload.amount;

  userWallet.balance -= amount;

  const transactions = await Transaction.create({
    type: PayType.WITHDRAW,
    amount: payload.amount,
    wallet: userWallet.id,
    initiatedBy: InitiatedBy.USER,
    status: PayStatus.COMPLETED,
  });

  await userWallet.save();

  sendDataToUser(req.user.id, 'withdraw-notify', transactions);

  return transactions;
};

const sendMoneyToDB = async (payload: ITransaction, req: Request) => {
  const [senderWallet, receiverUser] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    User.findOne({ contact: payload.contact }),
  ]);

  if (!senderWallet || senderWallet.isBlocked) {
    throw new ApiError(404, 'You can not send money');
  }

  if (senderWallet.balance < payload.amount) {
    throw new ApiError(400, 'You don’t have sufficient balance');
  }
  if (!receiverUser) {
    throw new ApiError(404, 'Sender contact number not found');
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser.id });

  if (!receiverWallet) {
    throw new ApiError(404, 'Sender Wallet not found for this user');
  }

  senderWallet.balance -= payload.amount;
  receiverWallet.balance += payload.amount;

  await Promise.all([senderWallet.save(), receiverWallet.save()]);

  const transaction = Transaction.create({
    type: PayType.SEND_MONEY,
    amount: payload.amount,
    wallet: senderWallet.id,
    initiatedBy: InitiatedBy.USER,
    status: PayStatus.COMPLETED,
  });

  sendDataToUser(req.user.id, 'send-money-notify', transaction);
  return transaction;
};

const getMyTransactionToDB = async (payload: Request) => {
  const userWallet = await Wallet.findOne({ user: payload.user.id });
  if (!userWallet) {
    throw new ApiError(400, 'Wallet not found for this user');
  }
  const transactions = await Transaction.find({ wallet: userWallet.id });
  return transactions;
};

const getAllUsersTransactionsToDB = async () => {
  const transactions = await Transaction.find();
  return transactions;
};

const cashInToDB = async (payload: ITransaction, req: Request) => {
  const receiverUser = await User.findById(payload.receiverId);
  if (!receiverUser)
    throw new ApiError(400, 'User not found with this receiverId');

  const [senderWallet, receiverWallet] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Wallet.findOne({ user: receiverUser._id }),
  ]);

  if (!senderWallet) throw new ApiError(400, 'Wallet not found for this user');
  if (!receiverWallet)
    throw new ApiError(400, 'Wallet not found for this user');
  if (senderWallet.isBlocked)
    throw new ApiError(400, 'This agent can not do cash-in');
  if (receiverWallet.isBlocked)
    throw new ApiError(400, 'This user can`t receive cash-in');
  if (senderWallet.balance < payload.amount)
    throw new ApiError(400, 'You don’t have sufficient balance');

  senderWallet.balance -= payload.amount;
  receiverWallet.balance += payload.amount;

  await Promise.all([senderWallet.save(), receiverWallet.save()]);

  const transactions = Transaction.create({
    type: PayType.CASH_IN,
    amount: payload.amount,
    wallet: senderWallet._id,
    initiatedBy: InitiatedBy.AGENT,
    status: PayStatus.COMPLETED,
  });

  sendDataToUser(req.user.id, 'cash-in-notify', transactions);
  return transactions;
};

const cashOutToDB = async (payload: ITransaction, req: Request) => {
  const receiverUser = await User.findById(payload.receiverId);
  if (!receiverUser)
    throw new ApiError(400, 'User not found with this receiverId');

  const [senderWallet, receiverWallet] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Wallet.findOne({ user: receiverUser._id }),
  ]);

  if (!senderWallet) throw new ApiError(400, 'Wallet not found for this user');
  if (!receiverWallet)
    throw new ApiError(400, 'Wallet not found for this user');
  if (senderWallet.isBlocked)
    throw new ApiError(400, 'This agent can not do cash-in');
  if (receiverWallet.isBlocked)
    throw new ApiError(400, 'This user can`t receive cash-in');
  if (senderWallet.balance < payload.amount)
    throw new ApiError(400, 'You don’t have sufficient balance');

  senderWallet.balance += payload.amount;
  receiverWallet.balance -= payload.amount;

  await Promise.all([senderWallet.save(), receiverWallet.save()]);

  const transactions = Transaction.create({
    type: PayType.CASH_IN,
    amount: payload.amount,
    wallet: senderWallet._id,
    initiatedBy: InitiatedBy.AGENT,
    status: PayStatus.COMPLETED,
  });

  sendDataToUser(req.user.id, 'cash-out-notify', transactions);
  return transactions;
};

export const TransactionService = {
  addMoneyToDB,
  withdrawMoneyToDB,
  sendMoneyToDB,
  getMyTransactionToDB,
  getAllUsersTransactionsToDB,
  cashInToDB,
  cashOutToDB,
};
