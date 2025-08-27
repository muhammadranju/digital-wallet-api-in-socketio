import { Request } from 'express';
// import { sendDataToUser } from '../../../helpers/socketManager';
import { IWallet } from './wallets.interface';
import { Wallet } from './wallets.model';

const getAllWalletsToDB = async () => {
  return await Wallet.find();
};

const getMyWalletToDB = async (userId: IWallet) => {
  return await Wallet.findOne({ user: userId });
};

const blockUserToDB = async (req: Request, walletId: string) => {
  const wallet = await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: true },
    { new: true }
  );

  // sendDataToUser(req.user.id, 'block-user-notify', wallet);
  return wallet;
};
const unBlockUserToDB = async (req: Request, walletId: string) => {
  const wallet = await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: false },
    { new: true }
  );
  // sendDataToUser(req.user.id, 'unblock-user-notify', wallet);

  return wallet;
};

export const WalletsService = {
  getAllWalletsToDB,
  getMyWalletToDB,
  blockUserToDB,
  unBlockUserToDB,
};
