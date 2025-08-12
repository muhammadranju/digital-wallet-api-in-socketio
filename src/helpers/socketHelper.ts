/* eslint-disable @typescript-eslint/no-explicit-any */
import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { Wallet } from '../app/modules/wallets/wallets.model';
import { logger } from '../shared/logger';

type AuthenticatedSocket = Socket & {
  user?: { id: string; role: string };
};

const socket = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(colors.blue('A user connected'));
    const userSid = socket.id;

    const handleWalletAction = async (
      action: string,
      notifyEvent: string,
      data: any
    ) => {
      try {
        socket.user = { id: data.userId, role: data.role };

        const wallet = await Wallet.findById(socket.user?.id);
        if (!wallet) {
          return socket.emit('error', { message: 'Wallet not found' });
        }
        if (wallet.isBlocked) {
          return socket.emit('error', { message: 'This wallet is blocked' });
        }

        socket.emit(notifyEvent, { userSid, ...data });
      } catch (err) {
        logger.error(err);
        socket.emit('error', { message: 'Internal server error' });
      }
    };

    socket.on('add-money', data =>
      handleWalletAction('add-money', 'add-money-notify', data)
    );

    socket.on('withdraw', data =>
      handleWalletAction('withdraw', 'withdraw-notify', data)
    );

    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnected'));
    });
  });
};

export const socketHelper = { socket };
