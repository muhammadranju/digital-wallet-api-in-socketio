import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IsActive, IUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES } from '../../../enums/user';
import { Request } from 'express';
// import { sendDataToUser } from '../../../helpers/socketManager';

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const approveUserToDB = async (req: Request, userId: string) => {
  const user = User.findByIdAndUpdate(
    userId,
    { isActive: IsActive.ACTIVE },
    { new: true }
  );
  // sendDataToUser(req.user.id, 'approve-user-notify', user);
  return user;
};

const suspendUserToDB = async (req: Request, userId: string) => {
  const user = User.findByIdAndUpdate(
    userId,
    { isActive: IsActive.SUSPENDED },
    { new: true }
  );
  // sendDataToUser(req.user.id, 'suspend-user-notify', user);
  return user;
};

const getAgentsToDB = async () => {
  const agents = await User.find({ role: USER_ROLES.AGENT }).select(
    'id name email contact role isActive status verified createdAt image'
  );
  return agents;
};

const getUsersToDB = async () => {
  const users = await User.find({ role: USER_ROLES.USER }).select(
    'id name email contact role isActive status verified createdAt image'
  );
  return users;
};

export const UserService = {
  getUserProfileFromDB,
  updateProfileToDB,
  approveUserToDB,
  suspendUserToDB,
  getAgentsToDB,
  getUsersToDB,
};
