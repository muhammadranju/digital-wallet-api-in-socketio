import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletsService } from './wallets.service';
import { Request, Response } from 'express';

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletsService.getAllWalletsToDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wallets data retrieved successfully',
    data: result,
  });
});
const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await WalletsService.getMyWalletToDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'My Wallet date get successfully',
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await WalletsService.blockUserToDB(walletId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User Block successfully',
    data: result,
  });
});
const unBlockUser = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;

  const result = await WalletsService.unBlockUserToDB(walletId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User UnBlock successfully',
    data: result,
  });
});

export const UserController = {
  getAllWallets,
  getMyWallet,
  blockUser,
  unBlockUser,
};
