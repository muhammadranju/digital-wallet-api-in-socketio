import { Request } from 'express';
import ApiError from '../../../errors/ApiError';
// import { sendDataToUser } from '../../../helpers/socketManager';
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

  const userAgent = await User.findOne({ contact: payload.contact });

  const userReceiver = await Wallet.findOne({ user: userAgent?._id });

  if (!userReceiver) {
    throw new ApiError(400, 'Receiver contact number not found');
  }
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
  userReceiver.balance -= amount;

  await userReceiver.save();

  const transactions = await Transaction.create({
    type: PayType.ADD_MONEY,
    amount: payload.amount,
    wallet: userWallet.id,
    initiatedBy: InitiatedBy.USER,
    status: PayStatus.COMPLETED,
  });

  // sendDataToUser(req.user.id, 'add-money-notify', transactions);

  await userWallet.save();

  return transactions;
};

const withdrawMoneyToDB = async (payload: ITransaction, req: Request) => {
  const userWallet = await Wallet.findOne({ user: req.user.id });

  const userAgent = await User.findOne({ contact: payload.contact });

  const userReceiver = await Wallet.findOne({ user: userAgent?._id });

  if (!userReceiver) {
    throw new ApiError(400, 'Receiver contact number not found');
  }

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

  if (!userAgent) {
    throw new ApiError(400, 'Sender contact number not found');
  }

  userWallet.balance -= amount;

  userReceiver.balance += amount;

  await userReceiver.save();

  const transactions = await Transaction.create({
    type: PayType.WITHDRAW,
    amount: payload.amount,
    wallet: userWallet.id,
    initiatedBy: InitiatedBy.USER,
    status: PayStatus.COMPLETED,
  });

  await userWallet.save();

  // sendDataToUser(req.user.id, 'withdraw-notify', transactions);

  return { transactions };
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

  // sendDataToUser(req.user.id, 'send-money-notify', transaction);
  return transaction;
};

const getMyTransactionToDB = async (payload: Request) => {
  const userWallet = await Wallet.findOne({ user: payload.user.id });
  if (!userWallet) {
    throw new ApiError(400, 'Wallet not found for this user');
  }
  const transactions = await Transaction.find({ wallet: userWallet.id })
    .sort({
      _id: -1,
    })
    .populate({
      path: 'wallet',
      populate: {
        path: 'user',
        model: 'User',
        select: 'name email',
      },
    });

  return transactions;
};

// const getMyTransactionToDB = async (payload: Request) => {
//   // Step 1: Find the user's wallet
//   const userWallet = await Wallet.findOne({ user: payload.user.id });
//   if (!userWallet) {
//     throw new ApiError(400, 'Wallet not found for this user');
//   }

//   // Step 2: Aggregation pipeline to get transactions for the user's wallet
//   const transactions = await Transaction.aggregate([
//     // Step 3: Lookup to get wallet details for each transaction
//     {
//       $lookup: {
//         from: 'wallets', // Wallet collection
//         localField: 'wallet', // Field in Transaction
//         foreignField: '_id', // Field in Wallet
//         as: 'walletDetails', // The populated wallet details will go into this array
//       },
//     },
//     // Step 4: Unwind the walletDetails array to access the wallet details
//     {
//       $unwind: {
//         path: '$walletDetails',
//         preserveNullAndEmptyArrays: false, // If no wallet is found, exclude the transaction
//       },
//     },
//     // Step 5: Match the wallet with the user's wallet (payload.user.id)
//     {
//       $match: {
//         'walletDetails.user': userWallet.user.toString(), // Ensure wallet belongs to the correct user
//       },
//     },
//     // Step 6: Sort by most recent transaction
//     {
//       $sort: { _id: -1 },
//     },
//     // Step 7: Populate the wallet field (optional)
//     {
//       $project: {
//         _id: 1,
//         amount: 1,
//         status: 1,
//         wallet: 1, // Keep the wallet field (or remove if not needed)
//         'walletDetails.balance': 1, // Optionally include wallet balance
//         'walletDetails.user': 1, // Optionally include user details inside the wallet
//         createdAt: 1,
//       },
//     },
//   ]);

//   return transactions;
// };

const getAllUsersTransactionsToDB = async () => {
  const transactions = await Transaction.aggregate([
    // Step 1: Lookup to join Transaction with Wallet based on the wallet ID in Transaction
    {
      $lookup: {
        from: 'wallets', // Name of the Wallet collection
        localField: 'wallet', // The field in Transaction that contains wallet reference
        foreignField: '_id', // The field in Wallet that matches
        as: 'walletDetails', // The result of the join will be in the walletDetails array
      },
    },
    // Step 2: Unwind the walletDetails array to get individual objects instead of an array
    {
      $unwind: {
        path: '$walletDetails', // Unwind the walletDetails array to flatten the structure
        preserveNullAndEmptyArrays: true, // If no walletDetails are found, preserve the empty results
      },
    },
    // Step 3: Lookup to join Wallet with User based on the user ID in Wallet
    {
      $lookup: {
        from: 'users', // Name of the User collection
        localField: 'walletDetails.user', // The field in Wallet that references the User
        foreignField: '_id', // The field in User that matches the user ID in Wallet
        as: 'userDetails', // The result of the join will be in the userDetails array
      },
    },
    // Step 4: Unwind the userDetails array to get individual user objects
    {
      $unwind: {
        path: '$userDetails', // Unwind the userDetails array to get user data
        preserveNullAndEmptyArrays: true, // If no userDetails are found, preserve the empty results
      },
    },
    // Step 5: Optionally, project the required fields to clean up the result
    {
      $project: {
        type: 1, // Include the transaction type
        amount: 1, // Include the amount
        status: 1, // Include the status
        wallet: 1, // Include wallet ID (if you want to keep it)
        'walletDetails.balance': 1, // Include wallet balance
        'userDetails.name': 1, // Include user name or any other user info
        'userDetails.email': 1, // Include user email or other relevant fields
        createdAt: 1, // Include the createdAt timestamp
      },
    },
    // Step 6: Sort by createdAt in descending order (latest first)
    {
      $sort: { createdAt: -1 }, // -1 for descending order
    },
  ]);

  return transactions;
};

const cashInToDB = async (payload: ITransaction, req: Request) => {
  const receiverUser = await User.findById({ _id: payload.receiverId });
  // console.log(receiverUser);
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

  // sendDataToUser(req.user.id, 'cash-in-notify', transactions);
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
    type: PayType.CASH_OUT,
    amount: payload.amount,
    wallet: senderWallet._id,
    initiatedBy: InitiatedBy.AGENT,
    status: PayStatus.COMPLETED,
  });

  // sendDataToUser(req.user.id, 'cash-out-notify', transactions);
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
