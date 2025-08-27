import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AGENT, USER_ROLES.USER),
    UserController.getUserProfile
  )
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.AGENT, USER_ROLES.USER),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/agents')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.AGENT),
    UserController.getAgents
  );
router
  .route('/get/users')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.AGENT),
    UserController.getUsers
  );

router
  .route('/approve/:id')
  .patch(auth(USER_ROLES.ADMIN), UserController.approveUser);
router
  .route('/suspend/:id')
  .patch(auth(USER_ROLES.ADMIN), UserController.suspendUser);

export const UserRoutes = router;
