import { IWallet } from './wallets.interface';
import { Wallet } from './wallets.model';

const getAllWalletsToDB = async () => {
  return await Wallet.find();
};

const getMyWalletToDB = async (userId: IWallet) => {
  return await Wallet.findOne({ user: userId });
};

const blockUserToDB = async (walletId: string) => {
  return await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: true },
    { new: true }
  );
};
const unBlockUserToDB = async (walletId: string) => {
  return await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: false },
    { new: true }
  );
};

export const WalletsService = {
  getAllWalletsToDB,
  getMyWalletToDB,
  blockUserToDB,
  unBlockUserToDB,
};
