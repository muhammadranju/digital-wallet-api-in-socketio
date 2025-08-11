import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from './transaction.service';

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const { ...addMoneyData } = req.body;

  const result = await TransactionService.addMoneyToDB(addMoneyData, req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Money added successfully',
    data: result,
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { ...withdrawData } = req.body;
  const result = await TransactionService.withdrawMoneyToDB(withdrawData, req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Money withdraw successfully',
    data: result,
  });
});
const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { ...sendMoneyData } = req.body;

  const result = await TransactionService.sendMoneyToDB(sendMoneyData, req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Money Send successfully',
    data: result,
  });
});

const getMyTransaction = catchAsync(async (req: Request, res: Response) => {
  const transactionData = await TransactionService.getMyTransactionToDB(req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Get My Transaction successfully',
    data: transactionData,
  });
});
const getAllUserTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const transactionData =
      await TransactionService.getAllUsersTransactionsToDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Get All Users Transaction successfully',
      data: transactionData,
    });
  }
);
const cashInTransactions = catchAsync(async (req: Request, res: Response) => {
  const { ...cashInData } = req.body;
  const cashInTransactionData = await TransactionService.cashInToDB(
    cashInData,
    req
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cash In Transaction successfully',
    data: cashInTransactionData,
  });
});
const cashOutTransactions = catchAsync(async (req: Request, res: Response) => {
  const { ...cashOutData } = req.body;
  const cashOutTransactionData = await TransactionService.cashOutToDB(
    cashOutData,
    req
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Cash out Transaction successfully',
    data: cashOutTransactionData,
  });
});

export const TransactionController = {
  addMoney,
  withdrawMoney,
  sendMoney,
  getMyTransaction,
  getAllUserTransactions,
  cashInTransactions,
  cashOutTransactions,
};
