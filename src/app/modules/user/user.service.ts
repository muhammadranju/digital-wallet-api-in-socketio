import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IsActive, IUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES } from '../../../enums/user';

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

const approveUserToDB = async (userId: string) => {
  return User.findByIdAndUpdate(
    userId,
    { role: USER_ROLES.AGENT },
    { new: true }
  );
};

const suspendUserToDB = async (userId: string) => {
  return User.findByIdAndUpdate(
    userId,
    { isActive: IsActive.SUSPENDED },
    { new: true }
  );
};

export const UserService = {
  getUserProfileFromDB,
  updateProfileToDB,
  approveUserToDB,
  suspendUserToDB,
};
